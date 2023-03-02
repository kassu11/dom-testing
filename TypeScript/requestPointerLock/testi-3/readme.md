# Hiiri lukittuu raahatessa

- Nyt voit seikkailla tekstin joukossa ja sun hiiri ei tuu menemään näytöstä yli
- Voit zoomaa myös scrollilla, jos haluat

## Testin syy ja ero

- `Testi 2` koodissa on outo bugi, jos clickkaa tosi nopeesti ja liikuttaa tosi vähän ja nopeesti hiirtä
- Kun tän tekee monta kertaa, niin joskus se saa tekstin liikkumaan satoja pixeleitä, vaikka liikutit ehkä 10
	- Yritän korjata tätä bugia tässä koodissa ja `test-2` jätetään vaan bugin dokumentoinniksi

## Muutokset

- Nähtävästi `requestPointerLock({ unadjustedMovement: true })` korjaa sen 500px hyppy bugin
- Muutin vähän muutenkin koodia, koska siellä oli nähtävästi turhia vaiheita :D
	- Samalla päivitin vähän muuttuja nimiä, joten toivon mukaan sitä on helpompi lukee nyt