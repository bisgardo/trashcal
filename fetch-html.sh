year=
address_id=

while getopts 'y:a:h' opt; do
	case "$opt" in
		y)
			year="$OPTARG"
			;;
		a)
			address_id="$OPTARG"
			;;
		h)
			echo "usage: fetch-data.sh -y YEAR -a ADDRESS_ID [-h]"
			exit 0
			;;
	esac
done
shift $((OPTIND-1))

>&2 echo "fetching data for address '$address_id' for the year $year"
>&2 echo "press ENTER to confirm or ^C to cancel"
read

# The Content-Type header must be set.
# Which is pretty dumb considering that the response is HTML even though JSON was specified.
curl -sS "https://mitaffald.affaldvarme.dk/Adresse/ToemmekalenderContent" \
	-H "Content-Type: application/json; charset=utf-8" \
	-H "Cookie: AddressId=$address_id" \
	--data-raw "{\"filterValues\":[\"Restaffald\",\"Genanvendeligt affald (Glas plast metal og papir pap)\"],\"year\":\"$year\"}"
