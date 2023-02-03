# Hiiren lukitus pohjassa pitäessä

- Jos painat harmaassa laatikossa hiirtä pohjassa niin hiiri lukittuu
- Sijaintisi päivittyy näytön alas `x` ja `y` kohtiin
- Koska hiiri on lukittu, se ei voi törmätä näyttöön, joten voit liikuttaa sitä niin pitkälle kun haluat

## Havainnot

- Nähtävästi toi ei tarvii olla await pyyntö
- Jos käyttäjä poistuu lukituksesta `esc` napilla, niin tulee error kun yrittää klikata `divii`
  - Jos sitä painaa tarpeeks se kyl alkaa taas toimii
- Teen demon, jossa tapahtuu jotain jännempää, mutta tämä on vain siisti pohja koodi konsepti