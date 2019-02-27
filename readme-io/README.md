Substrate docs on Readme.io
===

Importing Data docs:
https://readme.readme.io/v2.0/docs/importing-documentation

## Requirements

1) Name your file what you want the `slug` to be
    * i.e. `getting-started.md` -> `https://substrate.readme.io/docs/getting-started`
2) Prepend an underscore (`_`) for files you do not want to show up on readme.io

## Process

1) Add/Edit your files
2) Generate `.zip` file with version
3) Upload the `.zip` file to [settings](https://dash.readme.io/project/substrate/v1.0.0/settings)
4) Edit version stuff to make it work?

# API Process (does not work)

> Requires paid subscription

Using [readmeio/rdme](https://github.com/readmeio/rdme). Install with:

```bash
npm install rdme
```

## Login

```bash
Shawns-MBP:readme-io shawntabrizi$ rdme login
Email: shawn@parity.io
Password: 
Project subdomain: substrate
Successfully logged in as shawn@parity.io in the substrate project
```

## Push to Readme

```bash
Shawns-MBP:Substrate Overview shawntabrizi$ rdme docs ./ --version=1.0.1
You must upgrade your plan to have API access
```
