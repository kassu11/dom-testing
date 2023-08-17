# Kotoba bot decks

- Recently I started testing the Kotoba discord bot and wanted to make a custom deck for all the missing cards
- Obviously, this would take forever to do by hand, so I made this application to make it easier to make custom decks
- The decks can then be exported to a CSV file and then imported to the Kotoba bot

## Problems

- Jisho.org has a very restrictive API, probably because of all the AI scrapers, so this application doesn't really work that well
- You will have to reroute the API call vie cors-anywhere because otherwise, the response type is opaque
- The rate limit is also quite low
	- I'm not sure about the exact numbers, but definitely under hundred calls will get you blocked