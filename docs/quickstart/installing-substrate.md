---
title: "Installing Substrate"
---
[block:api-header]
{
  "title": "Skip to the End..."
}
[/block]
If you're running Mac OS, Arch, or a Debian-based OS like Ubuntu, then **with a good internet connection** just run our simple one-liner:
[block:code]
{
  "codes": [
    {
      "code": "curl https://getsubstrate.io -sSf | bash",
      "language": "shell"
    }
  ]
}
[/block]
This may take several minutes to finish. Once it is done, check that Substrate is properly installed by running `substrate --version`. You should see something like this:
[block:code]
{
  "codes": [
    {
      "code": "$ substrate --version\nsubstrate 0.10.0-fdb3a846-x86_64-linux-gnu",
      "language": "shell"
    }
  ]
}
[/block]
If you get that, then you're ready to proceed!
