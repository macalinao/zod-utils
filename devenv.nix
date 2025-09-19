{ pkgs, ... }:

{
  packages = with pkgs; [
    ast-grep
    biome
    git
  ];

  dotenv.enable = true;
  languages.javascript = {
    enable = true;
    bun.enable = true;
  };
}
