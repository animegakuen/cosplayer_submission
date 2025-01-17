{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages = {
          default = pkgs.callPackage ./nix/frontend.nix { };
          backend = pkgs.callPackage ./nix/backend.nix { };
        };

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm_9
          ];
        };
      }
    );
}
