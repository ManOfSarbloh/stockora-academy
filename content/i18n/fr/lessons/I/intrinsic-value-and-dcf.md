---
title: "La valeur intrinsèque et l'actualisation des flux de trésorerie (DCF)"
summary: "Une entreprise vaut l'argent qu'elle peut produire à l'avenir, ramené à aujourd'hui. Construisez pas à pas un DCF simple, voyez à quel point il dépend des hypothèses, et découvrez l'idée de marge de sécurité."
translatedFrom: 2026-10-11
---

Les ratios (leçon 7) comparent une entreprise à d'autres. La **valorisation intrinsèque** pose une question plus fondamentale : *que vaut cette entreprise par elle-même, d'après l'argent qu'elle produira ?*

L'*Owner's Manual* de Berkshire Hathaway en donne une définition simple : la valeur intrinsèque est **la valeur actualisée de l'argent qui peut être retiré d'une entreprise pendant le reste de sa vie**. Il ajoute aussitôt que le calcul n'est pas simple, et que la valeur intrinsèque est **une estimation plutôt qu'un chiffre précis**, qui doit changer quand les taux d'intérêt ou les prévisions de flux de trésorerie changent.

La même idée se retrouve en comptabilité : quand les IFRS (IAS 36) testent la dépréciation des actifs, l'une des mesures utilisées est la « valeur d'utilité », c'est-à-dire les flux de trésorerie futurs attendus **actualisés à leur valeur actuelle**.

## Étape 1 : l'argent d'aujourd'hui vaut plus que l'argent de demain

100 € aujourd'hui peuvent être investis et fructifier. 100 € reçus dans un an valent donc **moins** que 100 € aujourd'hui. Combien de moins dépend du rendement que vous exigez, appelé le **taux d'actualisation**.

**Valeur actuelle = argent futur ÷ (1 + taux d'actualisation)^années**

> [!EXAMPLE] Actualiser un paiement
> 100 € dans un an, taux d'actualisation de 8 % : 100 ÷ 1,08 = **92,59 €** aujourd'hui.
> 100 € dans deux ans : 100 ÷ 1,08² = **85,73 €** aujourd'hui.

Ce sont les intérêts composés (catégorie G) à l'envers.

## Étape 2 : un DCF simple, pas à pas

Un modèle d'**actualisation des flux de trésorerie (DCF)** prévoit l'argent qu'une entreprise générera, puis ramène chaque année à aujourd'hui. Voici un exemple simplifié, par action, pour une entreprise inventée. Chaque donnée est une **hypothèse** :

- Flux de trésorerie disponible par action l'an prochain : **1,20 €**
- Croissance pendant les cinq prochaines années : **5 %** par an
- Croissance ensuite, pour toujours : **2 %** par an
- Taux d'actualisation (le rendement exigé par un investisseur) : **9 %**

**Années 1 à 5 :**

| Année | Flux de trésorerie (€) | Facteur d'actualisation | Valeur actuelle (€) |
|---:|---:|---:|---:|
| 1 | 1,20 | ÷ 1,09 | 1,10 |
| 2 | 1,26 | ÷ 1,09² | 1,06 |
| 3 | 1,32 | ÷ 1,09³ | 1,02 |
| 4 | 1,39 | ÷ 1,09⁴ | 0,98 |
| 5 | 1,46 | ÷ 1,09⁵ | 0,95 |
| | | **Somme** | **≈ 5,12** |

(Les lignes sont arrondies ; leur somme ne tombe donc pas juste.)

**Après l'année 5 : la valeur terminale.** Personne ne peut prévoir chaque année indéfiniment ; le modèle suppose donc une croissance régulière après l'année 5 et utilise la formule de la rente perpétuelle croissante :

**Valeur terminale = flux de trésorerie de l'année 6 ÷ (taux d'actualisation − croissance à long terme)**

> [!EXAMPLE] Valeur terminale
> Flux de trésorerie de l'année 6 = 1,46 × 1,02 ≈ 1,49 €.
> Valeur terminale à la fin de l'année 5 = 1,49 ÷ (0,09 − 0,02) ≈ **21,25 €**.
> Actualisée à aujourd'hui : 21,25 ÷ 1,09⁵ ≈ **13,81 €**.

**Total :** 5,12 + 13,81 ≈ **18,93 € par action**.

Remarquez qu'environ **73 %** de la valeur vient de la valeur terminale : des flux de trésorerie à plus de cinq ans, fondés sur les hypothèses les plus grossières.

## Étape 3 : à quel point la réponse est-elle sensible ?

Changez seulement le taux d'actualisation et le taux de croissance à long terme, et voyez ce qui se passe :

| Taux d'actualisation ↓ / croissance à long terme → | 1 % | 2 % | 3 % |
|---|---:|---:|---:|
| **8 %** | 19,58 € | 22,13 € | 25,71 € |
| **9 %** | 17,08 € | 18,93 € | 21,39 € |
| **10 %** | 15,14 € | 16,53 € | 18,31 € |

De petits changements d'un point de pourcentage font passer la « valeur » d'environ 15 € à presque 26 €. Un DCF n'est pas une mesure. C'est une façon structurée de rendre vos hypothèses visibles.

> [!WARNING] Hypothèses fausses, résultat faux
> On peut faire produire à un DCF presque n'importe quel chiffre. Méfiez-vous surtout des modèles qui supposent une forte croissance pendant de nombreuses années, un taux de croissance à long terme supérieur à la croissance de long terme de l'économie, ou un taux d'actualisation qui paraît bas pour le risque.

## Le DCF inversé : que suppose le marché ?

Au lieu d'estimer une valeur, vous pouvez vous demander quelles hypothèses implique le **cours actuel**. Avec le modèle le plus simple, une seule rente perpétuelle croissante :

**Cours = flux de trésorerie de l'an prochain ÷ (taux d'actualisation − croissance)**, donc **croissance = taux d'actualisation − flux de trésorerie ÷ cours**

> [!EXAMPLE] Ce qu'implique un cours de 24 €
> Flux de trésorerie de l'an prochain 1,20 €, rendement exigé 9 %, cours 24 € :
> Croissance implicite = 9 % − 1,20 ÷ 24 = 9 % − 5 % = **4 % par an, pour toujours**.
>
> La question devient alors : 4 % de croissance pour toujours, est-ce réaliste pour cette entreprise ? C'est plus facile à discuter qu'une « juste valeur » abstraite.

## La marge de sécurité

Comme la valeur intrinsèque n'est qu'une estimation, les investisseurs prudents prévoient une marge. Dans sa lettre de 1992, Warren Buffett écrivait que Berkshire exige une **marge de sécurité** dans le prix d'achat : si la valeur calculée d'une action n'est que légèrement supérieure à son cours, ils ne sont pas intéressés. Il qualifie ce principe, sur lequel Benjamin Graham insistait beaucoup, de pierre angulaire du succès en investissement.

> [!EXAMPLE] Une marge de sécurité en chiffres
> Valeur estimée 18,93 €. Quelqu'un qui exige une marge de sécurité de 25 % n'envisagerait que des cours inférieurs ou égaux à 18,93 × 0,75 ≈ **14,20 €**.

C'est une façon de réfléchir aux erreurs d'estimation, pas une recommandation d'acheter quoi que ce soit à n'importe quel prix.

## D'où vient le taux d'actualisation

Les professionnels le déduisent généralement des taux d'intérêt, plus une prime pour le risque des actions (la **prime de risque des actions**) et le risque propre à l'entreprise. Aswath Damodaran, à NYU Stern, publie des estimations régulièrement mises à jour de ces données, dont des primes de risque implicites. Pour apprendre, l'essentiel est plus simple : **plus le risque est élevé, plus le taux d'actualisation est élevé, et plus la valeur aujourd'hui est faible.** La hausse des taux d'intérêt fait aussi monter les taux d'actualisation ; c'est l'une des raisons pour lesquelles les cours, surtout ceux des entreprises dont les flux de trésorerie sont lointains, baissent souvent quand les taux montent.

## À retenir

> [!TAKEAWAYS]
> - Valeur intrinsèque = la valeur actualisée de l'argent qu'une entreprise peut produire pendant sa vie ; c'est toujours une estimation.
> - Valeur actuelle = argent futur ÷ (1 + taux d'actualisation)^années.
> - Un DCF simple : prévoir quelques années, ajouter une valeur terminale, tout actualiser à aujourd'hui.
> - La valeur terminale domine souvent, et de petits changements d'hypothèses font beaucoup bouger le résultat.
> - Un DCF inversé montre la croissance qu'implique le cours actuel ; une marge de sécurité tient compte des erreurs.
