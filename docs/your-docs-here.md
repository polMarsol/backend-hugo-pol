# REST API Design

En aquest apartat es mostren algunes de les decisions preses en la implementació dels mètodes, entrypoints i requests realitzades.

## 1️⃣ Mètodes

La lògica que hem seguit per la creació de mètodes ha estat CRUD.

Com es pot observar en les 4 entitats grans de l'aplicació (users, shops, orders i products) tenim mètodes que corresponen a les funcions de Create, Read, Update i Delete.

D'altra banda, en les 3 entitats auxiliars que hem creat hem buscat implementar els mètodes que ens permetessin fer les consultes que potseriorment realitzariem.

Tota aquesta lògica de treball es troba en la carpeta models.

També comentar que tenim un fitxer index.js que correspon a la creació de la base de dades i fa una inserció de dades incials.


## 2️⃣ Entrypoints
La lògica dels nostres entrypoints amb les consultes (Get, Post, Put, Delete) ve en base a les funcions implementades anteriorment en les entitats de la classe models.

Com es pot observar tornem a seguir una estrcutura CRUD i ens els diferents arxius de la classe controllers trobem peticions que fan referencia a aquestes.

## 3️⃣ Requests

Seguint amb la dinàmica anterior hem estructurat les nostres requests de manera que cadascuna representi una de les entitats principals de l'aplicació.

En aquests arxius acabats amb extensió http podem probar les consultes implementades anteriorment en els controllers i obtenir la resposta que ens dona la API en base a aquesta consulta.

## 4️⃣ 🔹 Test

Com a verificació de la feina feta podem trobar la carpeta test on novament està estructurada en 4 arxius corresponent a les entitats més importants.

En aquests arxius podem trobar com, en un ambient de test, configurat en el nostre arxiu .env es realitzen diverses proves.

A nivell de testing hauriem de tenir en compte el coverage d'aquest (és a dir les /ines de codi que s'executen en cada test) i mirar d'obtenir un 70/80%.

**Coneixement obtinguts en una assignatura que realitzo a Madrid (Hugo)

En aquest cas no tenim, de moment, eines per evaluar aquest aspecte així que hem realitzar varis testos els quals en entregues posteriors serán ampliats per augmentar la fiabilitat dels mètodes realitzats.

Volem posar enfàsi però en que tots les consultes proporcionades en els arxius .http responen al comportament desitjat de manera fiable.
