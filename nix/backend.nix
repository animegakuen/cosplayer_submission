{
  stdenv,
  nodejs,
  pnpm_9,
}:

stdenv.mkDerivation rec {
  pname = "animegakuen-cosplay-backend";
  version = "0-unstable-2025-03-05";
  src = ../.;

  nativeBuildInputs = [
    nodejs
    pnpm_9.configHook
  ];

  pnpmWorkspaces = [ "@animegakuen/cosplay-backend" ];
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

    patchShebangs packages/backend/bin/start.js

    pnpm --filter "@animegakuen/cosplay-backend" build

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
