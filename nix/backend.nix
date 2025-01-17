{
  stdenv,
  nodejs,
  pnpm_9,
}:

stdenv.mkDerivation rec {
  pname = "cosplayer_submission-backend";
  version = "0-unstable-2025-01-17";
  src = ../.;

  nativeBuildInputs = [
    nodejs
    pnpm_9.configHook
  ];

  pnpmWorkspaces = [ "backend" ];
  pnpmDeps = pnpm_9.fetchDeps {
    inherit
      pname
      version
      src
      pnpmWorkspaces
      ;
    hash = "sha256-IKqOCYFJND55l4XngQxqFWf9T8IhdRM2ymI5ZegoCRI=";
  };

  buildPhase = ''
    runHook preBuild

    pnpm --filter=backend build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{bin,lib/cosplayer_submission}

    cp -r {packages,node_modules} $out/lib/cosplayer_submission
    ln -s $out/lib/cosplayer_submission/packages/backend/bin/start.js $out/bin/cosplayer_submission

    runHook postInstall
  '';
}
