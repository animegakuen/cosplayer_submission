{
  stdenv,
  nodejs,
  pnpm_9,
}:

stdenv.mkDerivation rec {
  pname = "cosplayer_submission-frontend";
  version = "0-unstable-2025-01-17";
  src = ../.;

  nativeBuildInputs = [
    nodejs
    pnpm_9.configHook
  ];

  pnpmWorkspaces = [ "frontend" ];
  pnpmDeps = pnpm_9.fetchDeps {
    inherit
      pname
      version
      src
      pnpmWorkspaces
      ;
    hash = "sha256-0ZYwecxhgqOwJ4c5T1dQK7p0/a1pkZ2/wFke+LkxU2A=";
  };

  buildPhase = ''
    runHook preBuild

    pnpm --filter=frontend build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/share
    cp -r packages/frontend/dist/* $out/share/

    runHook postInstall
  '';
}
