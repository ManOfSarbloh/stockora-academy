---
title: "Wie lange eine Order gilt: Tag, GTC, IOC und FOK"
summary: Neben Preisbedingungen haben Orders auch Zeitbedingungen. Sie entscheiden, ob eine nicht ausgeführte Order am Tagesende gelöscht wird, offen bleibt oder sofort ausgeführt werden muss.
translatedFrom: 2026-10-11
---

Jede Order hat eine **Gültigkeit**: wie lange sie aktiv bleibt, wenn sie nicht sofort ausgeführt wird. Wer sich hier vertut, erlebt häufig, dass Orders „verschwinden“ oder, schlimmer, Wochen später ausgeführt werden, wenn man nicht mehr damit rechnet.

## Die üblichen Gültigkeiten

| Gültigkeit | Was sie bedeutet |
|---|---|
| **Tagesorder** | Gilt nur für den Handelstag, an dem sie eingegeben wird. Wird sie nicht ausgeführt, wird sie grundsätzlich am Ende der regulären Handelszeit gelöscht. |
| **Gültig bis auf Widerruf (GTC)** | Bleibt offen, bis sie ausgeführt wird oder du sie löschst. Broker setzen meist eine Höchstdauer; frag deinen. |
| **Gültig bis Datum** | Bleibt bis zu einem von dir gewählten Datum offen. |
| **Immediate-or-Cancel (IOC)** | Muss sofort ausgeführt werden; jeder Teil, der nicht sofort ausgeführt werden kann, wird gelöscht. |
| **Fill-or-Kill (FOK)** | Muss sofort **vollständig** ausgeführt werden; sonst wird die ganze Order gelöscht (keine Teilausführungen). |

> [!EXAMPLE]
> Du gibst eine GTC-Kauf-Limit-Order zu **45 €** für eine Aktie auf, die bei 50 € notiert, und vergisst sie dann. Drei Monate später fällt der Kurs nach schlechten Nachrichten auf 45 €, und deine Order wird ausgeführt. Jetzt besitzt du Aktien, die du in diesem Moment gar nicht mehr kaufen wolltest.

> [!EXAMPLE]
> Du willst genau 1.000 Aktien und keine weniger. Mit **Fill-or-Kill** werden entweder sofort alle 1.000 gekauft oder keine. Mit **Immediate-or-Cancel** bekommst du vielleicht jetzt 400, und der Rest wird gelöscht.

## Tipps

- Prüfe regelmäßig deine **offenen Orders**, vor allem GTC-Orders.
- Wisse, ob die Standardgültigkeit deines Brokers „Tag“ oder „bis auf Widerruf“ ist.
- Frag deinen Broker, was mit deinen offenen Orders bei Ereignissen wie einem Aktiensplit passiert.

> [!MISTAKE] „Meine Order wurde heute nicht ausgeführt, also ist sie weg“
> Nicht unbedingt. War sie bis auf Widerruf gültig, wartet sie noch im Markt und kann jederzeit ausgeführt werden.

## Das Wichtigste in Kürze

> [!TAKEAWAYS]
> - Tagesorders verfallen am Ende des Handelstags; GTC-Orders bleiben offen, bis sie ausgeführt oder gelöscht werden.
> - IOC führt aus, was sofort geht, und löscht den Rest; FOK wird sofort vollständig oder gar nicht ausgeführt.
> - Prüfe offene Orders regelmäßig, um überraschende Ausführungen zu vermeiden.
