Addresses [downloaded](https://dawadocs.dataforsyningen.dk/dok/adresser#download-af-adresser)
and relevant fields extracted using command
```shell
curl 'https://api.dataforsyningen.dk/adresser?kommunekode=0751&format=json' |
jq '[.[]|{vejnavn: .adgangsadresse.vejstykke.navn, husnr: .adgangsadresse.husnr, postnr: .adgangsadresse.postnummer.nr, postnrnavn: .adgangsadresse.postnummer.navn}]' > addresses-aarhus.json
```

The file was then gzipped.
