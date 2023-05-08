# Mouse lock with elements

- This is a continuation of the previous base code
- Now the box has text and you can move and zoom inside the box
- The zoom is done by scrolling with your mouse

## Reason for this test

- `Test 2` has a weird bug if you click super fast and simultaneously move your mouse fast but super only a tiny amount
- This can cause the box content to move hundreds of pixels, even tho you moved way less
	- `Test 3` will only fix this one bug and `Test 2` will stay to give some documentation for the bug

## Changes

- So the bug is fixed if you use `requestPointerLock({ unadjustedMovement: true })`
- Because the bug was just one line fix, I also renamed some variables and cleaned the code up
	- Hopefully, it is now easier to read


<br>
<br>
<br>


# Hiiren lukitus elementtien kanssa

- Tämä on jatkoa edelliseen pohja koodiin
- Harma laatikko on nyt vähän paremman näkönen, koska siellä on tekstiä mitä voi liikuttaa ja suurentaa
- Suurennus tapahtuu hiiren scrollista

## Testin syy ja erot

- `Testi 2` koodissa on outo bugi, jos clickkaa tosi nopeesti ja liikuttaa tosi vähän ja nopeesti hiirtä
- Kun tän tekee monta kertaa, niin joskus se saa tekstin liikkumaan satoja pixeleitä, vaikka liikutit ehkä 10
	- Yritän korjata tätä bugia tässä koodissa ja `test-2` jätetään vaan bugin dokumentoinniksi

## Muutokset

- Nähtävästi `requestPointerLock({ unadjustedMovement: true })` korjaa sen 500px hyppy bugin
- Muutin vähän muutenkin koodia, koska siellä oli nähtävästi turhia vaiheita :D
	- Samalla päivitin vähän muuttuja nimiä, joten toivon mukaan sitä on helpompi lukee nyt