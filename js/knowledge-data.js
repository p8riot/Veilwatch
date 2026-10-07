window.tosKnowledge = {
    "metadata": {
        "schemaVersion": 1,
        "generatedFor": "Veilwatch 0.4.1",
        "pms": {
            "version": "2.3.1",
            "entry": "trackers/pms/Index.html",
            "sha256": "b02ac0b8586a4325057b9ff575a3d974a52bdab115fb9c22cd16cba7b13c1218"
        },
        "ass": {
            "version": "1.4.1",
            "entry": "trackers/ass/cleanse.html",
            "sha256": "c9ed29f24c6396e60a9795fcc559344f4ca76093672b873c78e9710455167d6f"
        },
        "ghostCount": 25
    },
    "ghosts": [
        {
            "name": "Ataphoi",
            "ev": [
                "Audio",
                "EMF",
                "Ghost Orb"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "High",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "LOS speed increases by 10% per Holy Water spray in subsequent hunts",
                "No manifest events; Shadow events only",
                "Cannot turn on or off lights",
                "Can turn radios on and off"
            ],
            "tags": [
                "shadow-only",
                "lights-ignore",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "losspeed"
            ],
            "conditionalSpeed": true,
            "lore": "A restless spirit from ancient Greek lore, believed to bring misfortune and sickness to the living. Investigators report rarely seeing the Ataphoi in full form.",
            "verifiedNotes": true,
            "speedProfile": {
                "los": {
                    "display": "Normal: 2.70m/s | +10% per spray in subsequent hunts",
                    "conditions": [
                        {
                            "label": "Normal",
                            "cmps": 270
                        }
                    ]
                }
            },
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Cannot interact",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Shadow only",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Ataphoi",
                "origin": "Ancient Greek beliefs about the restless dead",
                "summary": "Ataphoi, literally the unburied, were the dead who had not received proper burial rites. Ancient Greek ghost traditions treated improper burial as one reason a dead person might remain restless and unable to pass peacefully into the expected afterlife.",
                "source": "https://www.thecollector.com/ghost-stories-ancient-greece-rome/"
            }
        },
        {
            "name": "Banshee",
            "ev": [
                "Audio",
                "EMF",
                "Radiation"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "forced": "Audio",
            "desc": [
                "25% chance to hear a Banshee scream after returning from the Astral Realm",
                "Can scream through radios when it turns them on",
                "Higher heart rate increases the chance of screaming through audio equipment and radios"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Banshee is a chilling presence tied to omens of death, amplifying fear through its signature piercing screams and erratic electrical interference. Investigators close with death claim to hear the Banshee's cries.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Banshee",
                "origin": "Irish folklore",
                "summary": "The banshee, from Irish bean sí, is a female supernatural figure whose keening or wailing traditionally warns that a death is approaching in a family. Accounts vary in appearance, but the death-omen role is central to the tradition.",
                "source": "https://en.wikipedia.org/wiki/Banshee"
            }
        },
        {
            "name": "Bhoot",
            "ev": [
                "Freezing",
                "Radiation",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Long",
            "cd_val": 3,
            "forced": "Freezing",
            "desc": [
                "About 3 seconds before a hunt, the room the ghost starts hunting from can drop roughly 30°F / 16.67°C from its current temperature",
                "This pre-hunt cold behavior still applies on 0 Real Evidence runs and can show freezing",
                "Can leave freezing temperatures on interacted objects",
                "Its long hunt cooldown can also delay the first hunt"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Bhoot is a tormented soul, bound to the place of its suffering and fueled by a need for vengeance. Investigators report experiencing intense cold when the Bhoot is nearing.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Bhoot",
                "origin": "South Asian folklore",
                "summary": "Bhoot or bhūta is a broad South Asian term for the spirit of a deceased person. Folklore often describes a bhoot as restless because of violent death, unfinished matters, or improper funerary rites, although beliefs differ greatly by region and community.",
                "source": "https://en.wikipedia.org/wiki/Bhoota_(ghost)"
            }
        },
        {
            "name": "Demon",
            "ev": [
                "Radiation",
                "UV",
                "Writing"
            ],
            "speed": "Medium",
            "losspeed": "Very Slow",
            "los": "Far",
            "hw": "High",
            "cooldown": "Short",
            "cd_val": 1,
            "huntThresholdBpm": 77,
            "desc": [
                "Holy Water blocks the next hunt for 2 minutes after the last spray; after that hunt, the cooldown returns to normal unless sprayed again",
                "Can leave hot temperatures on interacted objects",
                "Can hunt as early as 77 BPM average heart rate for investigators inside the investigation area",
                "Can randomly lock doors and does so at a much higher frequency, even when door locks are disabled"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "cooldown",
                "hw"
            ],
            "lore": "The Demon is an unrelenting force of malice, driven purely by its desire to harm. Investigators report intense bouts of aggression, and items becoming hot to the touch. Holy water seems to keep the Demon at bay, for a short while.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Demon",
                "origin": "Many religious and folkloric traditions",
                "summary": "Demon is not one single traditional creature. Across many cultures and religions the word is used for harmful, dangerous, or morally hostile supernatural beings, with very different origins and traits depending on the tradition.",
                "source": "https://en.wikipedia.org/wiki/Demon"
            }
        },
        {
            "name": "Doppelganger",
            "ev": [
                "Ghost Orb",
                "UV",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Near",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Returns to its favorite room and starts the hunt from the middle of it",
                "Only ghost that is obligated to hunt from its favorite room"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Doppelganger is a deceptive spirit, often tricking its intended targets. Investigators report feeling alone moments before the ghost hunts. Where does it go?",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Doppelganger",
                "origin": "German-language supernatural tradition",
                "summary": "A doppelgänger is a double or ghostly counterpart of a living person. Stories of supernatural doubles occur in many cultures, while the German term became widely associated with uncanny apparitions and doubles in European literature and folklore.",
                "source": "https://en.wikipedia.org/wiki/Doppelg%C3%A4nger"
            }
        },
        {
            "name": "Echo",
            "ev": [
                "Freezing",
                "Ghost Orb",
                "UV"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Main Breaker: Cannot Directly Interact",
                "Individual Breakers: Turns Off",
                "Cannot turn on or off lights",
                "Cannot turn on or off radios",
                "Cannot deactivate FLX-PODs",
                "Cannot extinguish candles"
            ],
            "tags": [
                "no-breaker",
                "lights-ignore",
                "radio-ignore",
                "flx-ignore",
                "no-extinguish"
            ],
            "lore": "The Echo is a passive, residual spirit. Investigators report an eerily silent atmosphere, with lights never being affected by this ghost.",
            "verifiedNotes": true,
            "individualBreaker": "Off",
            "interactionBehaviors": {
                "Main Breaker": "Cannot directly interact",
                "Individual Breakers": "Can turn off only",
                "Lights": "Cannot interact",
                "Radio": "Cannot interact",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Echo",
                "origin": "Likely Greek myth / broader haunting motif",
                "summary": "Greek mythology's Echo is an Oread, or mountain nymph, whose story became associated with a voice that can only repeat what others have said. There is no standard traditional ghost species called The Echo, and modern paranormal use of 'echo' also overlaps with ideas of residual or repeated hauntings.",
                "note": "The Greek Echo is a mythological figure, not traditionally a ghost type equivalent to the game's entity.",
                "source": "https://en.wikipedia.org/wiki/Echo_(mythology)"
            }
        },
        {
            "name": "Forgotten",
            "ev": [
                "Ghost Orb",
                "Radiation",
                "Writing"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Cannot manifest in full-form outside of a hunt",
                "Cannot deactivate FLX-PODs"
            ],
            "tags": [
                "shadow-only",
                "flx-ignore",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Forgotten has a nearly silent presence. Passive, cold, and elusive, as if it's barely there at all. Investigators report minimal activity, no defining behavior, and a feeling of safety, until the Forgotten strikes.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Shadow only",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Forgotten",
                "origin": "Broad ghostlore motif",
                "summary": "No single established folklore entity called The Forgotten could be identified. The idea of neglected, improperly remembered, or restless dead is widespread across ghost traditions, where lack of burial, ritual, justice, or remembrance can be used to explain why a spirit remains.",
                "note": "This entry describes a broad folklore motif rather than claiming a specific traditional creature behind the game's name.",
                "source": "https://en.wikipedia.org/wiki/Ghost"
            }
        },
        {
            "name": "Hupia",
            "ev": [
                "EMF",
                "Ghost Orb",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Medium",
            "los": "Near",
            "hw": "None",
            "cooldown": "Medium",
            "cd_val": 2,
            "huntThresholdBpm": 77,
            "desc": [
                "Immune to Holy Water and will laugh when sprayed",
                "Can hunt as early as 77 BPM average heart rate for investigators inside the investigation area",
                "Cannot extinguish candles",
                "Cannot deactivate FLX-PODs"
            ],
            "tags": [
                "no-extinguish",
                "flx-ignore",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "hw"
            ],
            "lore": "A spirit from Taino Folklore, the Hupia is a nocturnal spirit, known to be incredibly active after-dark. Investigators report feeling ill-prepared for the aggression the Hupia shows.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Hupia",
                "origin": "Taíno spiritual tradition",
                "summary": "A hupia is the spirit of a person who has died in Taíno belief. Hupias were contrasted with the spirits of the living, associated strongly with nighttime, and were said in surviving accounts to take different forms, including faceless human-like appearances.",
                "source": "https://en.wikipedia.org/wiki/Hupia"
            }
        },
        {
            "name": "Iblis",
            "ev": [
                "Audio",
                "Freezing",
                "Writing"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Shapeshifts during hunts; the changes are cosmetic only"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Iblis is a powerful and enigmatic entity, rooted in ancient lore and associated with magic, and free will. Investigators report seeing the ghost appear to change form, appearing more \"alive\".",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Iblis",
                "origin": "Islamic tradition",
                "summary": "Iblis is the figure who refuses the divine command to bow before Adam and becomes an adversarial tempter of humanity. Islamic traditions discuss his nature in relation to jinn, devils, disobedience, pride, and free will.",
                "source": "https://en.wikipedia.org/wiki/Iblis"
            }
        },
        {
            "name": "Marid",
            "ev": [
                "Ghost Orb",
                "Radiation",
                "UV"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Provides 1 false Diminishing evidence by leaving diminished evidence levels behind",
                "The false evidence can be one of Marid's own assigned evidence types",
                "Cannot fake Freezing evidence",
                "Can provide its 1 false evidence even on 0 Real Evidence runs",
                "Can light candles"
            ],
            "tags": [
                "can-light-candle",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "specialDiminishing": true,
            "lore": "A powerful spirit from Arabic Folklore, it is believed to wield great supernatural influence, bringing misfortune and twisting the reality of those who encounter it.",
            "verifiedNotes": true,
            "specialDiminishingExtra": 1,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Can light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Marid",
                "origin": "Arabic and Islamic supernatural tradition",
                "summary": "Marid is an Arabic term associated with powerful rebellious supernatural beings, often discussed alongside jinn, devils, and later legendary traditions. Popular modern portrayals frequently treat marids as an especially powerful class of jinn, although historical usage is more varied.",
                "source": "https://en.wikipedia.org/wiki/Marid"
            }
        },
        {
            "name": "Nasnas",
            "ev": [
                "Audio",
                "Freezing",
                "Ghost Orb"
            ],
            "speed": "Slow",
            "losspeed": "Very Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "33% chance every 7.5 seconds during a hunt to enter a 5.00m/s burst state",
                "Burst state continues until it gets within 250cm of its target, then enters a 10-second cooldown",
                "Cooldown base speed is 2.42m/s and cooldown LOS speed is 2.70m/s",
                "Cannot turn on lights",
                "Cannot deactivate FLX-PODs"
            ],
            "tags": [
                "lights-off",
                "radio-on",
                "radio-off",
                "flx-ignore"
            ],
            "starred": [
                "losspeed"
            ],
            "conditionalSpeed": true,
            "lore": "Known for its relentless speed, the Nas Nas darts and lunges with unpredictable bursts of movement, losing distances in an instant, and turning any encounter into a race.",
            "verifiedNotes": true,
            "speedProfile": {
                "los": {
                    "display": "Normal: 2.00m/s | Burst: 5.00m/s | Cooldown: 2.70m/s",
                    "conditions": [
                        {
                            "label": "Normal",
                            "cmps": 200
                        },
                        {
                            "label": "Burst",
                            "cmps": 500
                        },
                        {
                            "label": "Cooldown",
                            "cmps": 270
                        }
                    ]
                }
            },
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Nasnas",
                "displayName": "Nasnās",
                "origin": "Arabic folklore",
                "summary": "The nasnās is a monstrous being in Arabic folklore commonly described as only half a human body, with one arm and one leg. Traditional descriptions emphasize its remarkable agility, hopping or moving quickly despite its incomplete form.",
                "source": "https://en.wikipedia.org/wiki/Nasnas"
            }
        },
        {
            "name": "Phantom",
            "ev": [
                "Audio",
                "Ghost Orb",
                "UV"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "forced": "UV",
            "desc": [
                "Cannot manifest in full-form outside of a hunt",
                "Cannot turn on radios",
                "Cannot deactivate FLX-PODs",
                "Cannot extinguish candles"
            ],
            "tags": [
                "shadow-only",
                "radio-off",
                "flx-ignore",
                "no-extinguish",
                "lights-on",
                "lights-off"
            ],
            "lore": "The Phantom is a sinister entity born from pure darkness, operating in silence and shadows. Investigators report frequent radio frequency interruptions, though they've never seen the phantom in full-form, only in the shadows.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Shadow only",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Phantom",
                "origin": "Broad European ghost terminology",
                "summary": "Phantom is a general term for an apparition, specter, or ghost rather than a single folklore species. Its meaning overlaps with long traditions of the dead appearing to the living as visible, shadowy, or otherwise perceptible presences.",
                "source": "https://en.wikipedia.org/wiki/Ghost"
            }
        },
        {
            "name": "Poltergeist",
            "ev": [
                "EMF",
                "Radiation",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "forced": "EMF",
            "desc": [
                "Frequently throws more objects than other ghosts"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Poltergeist is a chaotic and mischievous entity, notorious for its disruptive presence. Investigators report that this ghost thrives on manipulating the environment, throwing more objects than any other spirit.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Poltergeist",
                "origin": "German and European ghostlore",
                "summary": "Poltergeist literally means a noisy or knocking spirit. Reports and stories associated with the term focus on unexplained raps, movement or throwing of objects, and other disruptive physical disturbances rather than a quietly appearing apparition.",
                "source": "https://en.wikipedia.org/wiki/Poltergeist"
            }
        },
        {
            "name": "Puca",
            "ev": [
                "EMF",
                "Freezing",
                "Ghost Orb"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "During hunts, can imitate another ghost's full hunt behavior, including Base Speed, LOS Speed, and Holy Water Effectiveness",
                "LOS Range and Hunt Cooldown stay locked to Puca's own values while mimicking",
                "Does not copy forced-hunt behavior or Wiederganger's nearby anxiety-rate increase",
                "Cannot imitate the same ghost type in consecutive hunts",
                "Cannot extinguish candles"
            ],
            "tags": [
                "no-extinguish",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "huntBehaviorMimic": true,
            "lore": "Known for its unpredictable and mischievous nature, often toying with the living for its own amusement.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Púca",
                "origin": "Irish and broader Gaelic folklore",
                "summary": "The púca is a shapeshifting supernatural being known for unpredictability and mischief. It may appear in animal or humanlike forms, and stories range from frightening or dangerous encounters to pranks, warnings, and occasional good fortune.",
                "source": "https://en.wikipedia.org/wiki/P%C3%BAca"
            }
        },
        {
            "name": "Revenant",
            "ev": [
                "EMF",
                "UV",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Targeted player's stamina is reduced for the remainder of the contract, cutting sprint time from about 7 seconds to about 4 seconds"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Revenant is a relentless, high-threat entity known for its aggressive presence. Investigators report that being hunted by one feels like literal suffocation, making it harder to outrun.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Revenant",
                "origin": "Medieval European folklore",
                "summary": "A revenant is one who returns from the dead, traditionally as a spirit or animated corpse that comes back to trouble the living. Medieval European accounts often connect revenants with restless death, wrongdoing, fear, or unfinished conflict.",
                "source": "https://en.wikipedia.org/wiki/Revenant"
            }
        },
        {
            "name": "Shura",
            "ev": [
                "Freezing",
                "Ghost Orb",
                "Writing"
            ],
            "speed": "Medium",
            "losspeed": "Fast",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Short",
            "cd_val": 1,
            "forced": "Writing",
            "desc": [
                "Far LOS range is hard to break",
                "High LOS speed and range plus a short hunt cooldown make it difficult to escape"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Shura is a cursed spirit of pure rage, trapped between worlds by a fate even the underworld rejects. Fueled by violence, investigators warn of their aggression, speed, and keen eyes.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Shura",
                "origin": "Likely related to Buddhist Asura / Japanese Ashura tradition",
                "summary": "There is not a standard folklore ghost species called a Shura. The name is commonly connected to ashura/asura, powerful beings in Buddhist cosmology strongly associated with conflict, pride, jealousy, wrath, and ceaseless struggle.",
                "note": "This is a likely name inspiration, not a claim that the game's Shura is a direct reproduction of a traditional entity.",
                "source": "https://en.wikipedia.org/wiki/Asura_(Buddhism)"
            }
        },
        {
            "name": "Skia",
            "ev": [
                "Audio",
                "EMF",
                "UV"
            ],
            "speed": "Fast",
            "losspeed": "Fast",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Long",
            "cd_val": 3,
            "forced": "Audio",
            "desc": [
                "Within 350cm of its target, LOS speed drops from 3.10m/s to 2.35m/s; farther than 350cm is considered far",
                "33% chance every 5 seconds during a hunt to make a distressed/crying sound near a player",
                "Has unique non-aggressive audio responses",
                "Cannot deactivate FLX-PODs",
                "Cannot extinguish candles"
            ],
            "tags": [
                "flx-ignore",
                "no-extinguish",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "losspeed"
            ],
            "conditionalSpeed": true,
            "speedProfile": {
                "los": {
                    "display": "Farther than 350cm: 3.10m/s | Within 350cm: 2.35m/s",
                    "conditions": [
                        {
                            "label": "Farther than 350cm",
                            "cmps": 310
                        },
                        {
                            "label": "Within 350cm",
                            "cmps": 235
                        }
                    ]
                }
            },
            "lore": "The Skia is a guardian spirit. Revered in lore as a protector of people, places, or legacies. While not innately dangerous, investigators report distressed sounds, and unusual spirit box activity. Do not let your guard down.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Skia",
                "origin": "Ancient Greek terminology",
                "summary": "Skia is the Greek word for shadow or shade and can refer to the shade of a dead person. Classical Greek ideas of the dead often described them as insubstantial shades inhabiting the underworld rather than a single monster species called Skia.",
                "source": "https://en.wikipedia.org/wiki/Shade_(mythology)"
            }
        },
        {
            "name": "Sluagh",
            "ev": [
                "EMF",
                "Ghost Orb",
                "UV"
            ],
            "speed": "Medium",
            "losspeed": "Fast",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "forced": "Ghost Orb",
            "desc": [
                "Can produce multiple Ghost Orbs: 33% chance to show a cluster of 4 orbs when displaying them",
                "Can give Ghost Orbs on 0 Real Evidence runs",
                "Can light candles",
                "Cannot turn off lights",
                "Cannot deactivate FLX-PODs"
            ],
            "tags": [
                "can-light-candle",
                "lights-on",
                "radio-on",
                "radio-off",
                "flx-ignore"
            ],
            "lore": "A host of restless spirits in Irish and Scottish folklore, said to travel together as a dark force.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Can light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Sluagh",
                "origin": "Irish and Scottish Gaelic folklore",
                "summary": "The Sluagh, or host of the dead, are a dangerous airborne company of restless or unforgiven spirits in Gaelic folklore. Stories describe the host traveling together through the sky and sometimes carrying people away.",
                "source": "https://en.wikipedia.org/wiki/Sluagh"
            }
        },
        {
            "name": "Strigoi",
            "ev": [
                "Freezing",
                "UV",
                "Writing"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Increases investigators' heart rate by 50% while in the same room, which can lead to earlier hunts",
                "No manifest events; Shadow events only",
                "Can only turn radios on, not off",
                "Can light candles",
                "Cannot extinguish candles"
            ],
            "tags": [
                "shadow-only",
                "radio-on",
                "no-extinguish",
                "can-light-candle",
                "lights-on",
                "lights-off"
            ],
            "lore": "The Strigoi is a restless, undead spirit drawn from old legends, believed to rise from the grave to torment the living, especially under cover of night. Investigators report never seeing a Strigoi in full form, and feeling extra panicked when one is nearby.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Can light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Shadow only",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Strigoi",
                "origin": "Romanian folklore",
                "summary": "Strigoi are troubled or returning spirits in Romanian tradition, closely connected with later vampire lore. They are commonly described as restless dead capable of harming the living, and some traditions attribute transformation, invisibility, or the draining of vitality to them.",
                "source": "https://en.wikipedia.org/wiki/Strigoi"
            }
        },
        {
            "name": "Tantalus",
            "ev": [
                "EMF",
                "Freezing",
                "UV"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Never makes a closing motion to doors: if a door is open it cannot close it halfway, but if a door is closed it can open it halfway",
                "Cannot lock doors, even when door locks are enabled, except hiding and location entrance doors when a hunt starts",
                "Never slams doors except during a hunt",
                "Cannot deactivate FLX-PODs"
            ],
            "tags": [
                "no-doors",
                "flx-ignore",
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Tantalus is an aggressive spirit drawn to those who have encountered death, feeding off the emotional residue left behind. Investigators report this ghost as being quieter than others, and warn of less effective Holy Water.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Cannot deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Cannot close / lock"
            },
            "realWorldLore": {
                "name": "Tantalus",
                "origin": "Ancient Greek mythology",
                "summary": "Tantalus is a mythic king punished eternally in the underworld, famously placed near food and water that remain forever beyond his reach. There is no traditional ghost species called a Tantalus, so the game's use of the name appears to draw from the mythic figure and themes of punishment or torment.",
                "source": "https://en.wikipedia.org/wiki/Tantalus"
            }
        },
        {
            "name": "Tariaksuq",
            "ev": [
                "Audio",
                "EMF",
                "Freezing"
            ],
            "speed": "Slow",
            "losspeed": "Slow",
            "los": "Far",
            "hw": "Low",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Holy Water blocks the next hunt for 90 seconds after the last spray; after that hunt, the cooldown returns to normal unless sprayed again",
                "Faster in darkness; a lit lighter, headlamp, or flashlight pointed at it slows it to its regular LOS speed (phone flashlight does not count)",
                "Turns off lights more frequently than other ghosts",
                "Can blow out up to 10 candles at a time within proximity",
                "No manifest events; Shadow events only",
                "Cannot turn on lights"
            ],
            "tags": [
                "shadow-only",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "cooldown",
                "hw",
                "losspeed"
            ],
            "conditionalSpeed": true,
            "speedProfile": {
                "los": {
                    "display": "Light: 2.42m/s | Darkness: 3.10m/s",
                    "categories": [
                        "Slow",
                        "Fast"
                    ],
                    "conditions": [
                        {
                            "label": "Light",
                            "cmps": 242
                        },
                        {
                            "label": "Darkness",
                            "cmps": 310
                        }
                    ]
                }
            },
            "lore": "The Tariaksuq is a shadowy, elusive entity tied to darkness, death, and the unseen. Investigators report it as being impartial to the dark, often tinkering with any light source that dares to expose it.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Shadow only",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Tariaksuq",
                "origin": "Inuit mythology",
                "summary": "The Tariaksuq, often described as shadow people, are humanoid beings associated with invisibility and obscurity. Traditions describe them as living lives much like humans but slipping from direct perception, sometimes noticed only indirectly or by their shadows.",
                "source": "https://en.wikipedia.org/wiki/Tariaksuq"
            }
        },
        {
            "name": "Wewe Gombel",
            "ev": [
                "EMF",
                "Freezing",
                "Radiation"
            ],
            "speed": "Slow",
            "losspeed": "Fast",
            "los": "Far",
            "hw": "High",
            "cooldown": "Short",
            "cd_val": 1,
            "desc": [
                "Cannot directly interact with the main breaker except after a hunt",
                "Can turn individual breakers off",
                "Cannot turn on lights"
            ],
            "tags": [
                "no-breaker",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "The Wewe Gombel is a vengeful and malicious spirit, rooted in folklore as an unforgiving force that punishes those it deems deserving. Investigators report this ghost as incredibly fast, deeming Holy Water a necessity when having an encounter.",
            "verifiedNotes": true,
            "individualBreaker": "Off",
            "interactionBehaviors": {
                "Main Breaker": "Cannot directly interact",
                "Individual Breakers": "Can turn off only",
                "Lights": "Can turn off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Wewe Gombel",
                "origin": "Javanese / Indonesian folklore",
                "summary": "Wewe Gombel is a female supernatural figure from Javanese tradition, widely known for taking children. Many versions say she targets neglected or mistreated children, shelters them rather than simply harming them, and returns them after the adults responsible change their behavior.",
                "source": "https://en.wikipedia.org/wiki/Wewe_Gombel"
            }
        },
        {
            "name": "Wiederganger",
            "ev": [
                "Audio",
                "Ghost Orb",
                "Writing"
            ],
            "speed": "Slow",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "High",
            "cooldown": "Short",
            "cd_val": 1,
            "huntThresholdBpm": 77,
            "desc": [
                "Targeted player has increased stamina during a hunt, increasing sprint time from about 7 seconds to about 14 seconds",
                "Being close to the ghost while it is hunting increases anxiety rate dramatically",
                "Can hunt as early as 77 BPM average heart rate for investigators inside the investigation area"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "lore": "A dead soul that returns to the living world with unfinished business. It is often tied to vengeance or unrest, bringing increased dread to those who it seeks out.",
            "verifiedNotes": true,
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Wiederganger",
                "displayName": "Wiedergänger",
                "origin": "German folklore",
                "summary": "Wiedergänger means one who walks again, a German term for revenant and returning-dead traditions. Such beings were believed to return because of unrest, injustice, harmful influence, or an inability to leave the world of the living behind.",
                "source": "https://en.wikipedia.org/wiki/Wiederg%C3%A4nger"
            }
        },
        {
            "name": "Wisp",
            "ev": [
                "Freezing",
                "Ghost Orb",
                "Radiation"
            ],
            "speed": "Medium",
            "losspeed": "Medium",
            "los": "Far",
            "hw": "High",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "Holy Water blocks the next hunt for 2 minutes after the last spray; after that hunt, the cooldown returns to normal unless sprayed again",
                "Faster while in the light; turn off nearby light sources so it returns to its regular LOS speed (phone flashlight can stay on)",
                "Turns lights on significantly more than other ghosts",
                "Cannot interact with the main breaker or individual breakers",
                "Can light candles",
                "Cannot extinguish candles"
            ],
            "tags": [
                "no-breaker",
                "lights-on",
                "no-extinguish",
                "can-light-candle",
                "radio-on",
                "radio-off"
            ],
            "starred": [
                "cooldown",
                "hw",
                "losspeed"
            ],
            "conditionalSpeed": true,
            "speedProfile": {
                "los": {
                    "display": "Darkness: 2.70m/s | Light: 3.10m/s",
                    "categories": [
                        "Medium",
                        "Fast"
                    ],
                    "conditions": [
                        {
                            "label": "Darkness",
                            "cmps": 270
                        },
                        {
                            "label": "Light",
                            "cmps": 310
                        }
                    ]
                }
            },
            "lore": "The Wisp is a fast, deceptive and alluring spirit, often portrayed in folklore as a guiding light that leads the curious to their doom. Investigators report lights turning on frequently, and feel misguided by the Wisp's true intentions. Holy Water seems to keep the Wisp at bay.",
            "verifiedNotes": true,
            "individualBreaker": "None",
            "interactionBehaviors": {
                "Main Breaker": "Cannot directly interact",
                "Individual Breakers": "Cannot interact",
                "Lights": "Can turn on",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Can light",
                "Candle Extinguish": "Cannot extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Wisp",
                "origin": "European will-o'-the-wisp folklore",
                "summary": "Will-o'-the-wisps are mysterious lights reported at night, especially around marshes and lonely places. Folklore often interprets them as spirits, fairies, or wandering souls that lure travelers away from safe paths, although traditions vary by region.",
                "source": "https://en.wikipedia.org/wiki/Will-o%27-the-wisp"
            }
        },
        {
            "name": "Wraith",
            "ev": [
                "Audio",
                "Freezing",
                "UV"
            ],
            "speed": "Medium",
            "losspeed": "Fast",
            "los": "Far",
            "hw": "High",
            "cooldown": "Medium",
            "cd_val": 2,
            "desc": [
                "No visible feet during hunts",
                "No footstep sounds during hunts",
                "Targets one specific investigator when hunting but can kill anyone in its path",
                "If its primary target is alive and outside, it chooses a different target who is inside",
                "Reduced line-of-sight speed for the remainder of the hunt after being sprayed with Holy Water",
                "Easier to lose line-of-sight"
            ],
            "tags": [
                "lights-on",
                "lights-off",
                "radio-on",
                "radio-off"
            ],
            "conditionalSpeed": true,
            "lore": "The Wraith is a swift and vengeful entity, fueled by deep sorrow and rage. Investigators report them as incredibly fast entities, and report feeling targeted. You'll want Holy Water on hand for this ghost.",
            "verifiedNotes": true,
            "speedProfile": {
                "base": {
                    "cmps": 270
                }
            },
            "individualBreaker": "Both",
            "interactionBehaviors": {
                "Main Breaker": "Can directly interact",
                "Individual Breakers": "Can turn on / off",
                "Lights": "Can turn on / off",
                "Radio": "Can turn on / off",
                "FLX-POD": "Can deactivate",
                "Candle Light": "Cannot light",
                "Candle Extinguish": "Can extinguish",
                "Manifest": "Full form possible",
                "Doors": "Can close / lock"
            },
            "realWorldLore": {
                "name": "Wraith",
                "origin": "Scottish and broader British ghost terminology",
                "summary": "Wraith became a Scottish and English term for a ghostlike apparition or spectral image, often linked with death. Some traditions describe a wraith as an apparition of someone shortly before or after death rather than a single fixed monster type.",
                "source": "https://en.wikipedia.org/wiki/Wraith"
            }
        }
    ],
    "evidence": [
        {
            "id": "audio",
            "name": "Audio",
            "identifyLabel": "Audio",
            "aliases": [
                "audio",
                "spirit box",
                "sound"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": false,
            "cleanseName": "Audio",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Unintelligible Sounds"
                },
                {
                    "level": 2,
                    "text": "Single Word Responses"
                },
                {
                    "level": 3,
                    "text": "Intelligible Phrases"
                }
            ]
        },
        {
            "id": "emf",
            "name": "EMF",
            "identifyLabel": "EMF 20+",
            "aliases": [
                "emf",
                "e m f",
                "emf 20",
                "emf twenty"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": false,
            "cleanseName": "EMF",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Weak Anomalies (1.5 to 2.49 mG)"
                },
                {
                    "level": 2,
                    "text": "Moderate Disturbances (2.5 to 9.99 mG)"
                },
                {
                    "level": 3,
                    "text": "Strong Emissions (10 to 19.99 mG)"
                },
                {
                    "level": 4,
                    "text": "Overwhelming Fields (20+ mG)"
                }
            ]
        },
        {
            "id": "freezing",
            "name": "Freezing",
            "identifyLabel": "Freezing",
            "aliases": [
                "freezing",
                "cold",
                "freeze",
                "thermal"
            ],
            "diminishingAllowed": false,
            "diminishingVerified": false,
            "cleanseName": "Thermal",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Mild (0.1 to 4.4 C | 32.2 to 39.9 F)"
                },
                {
                    "level": 2,
                    "text": "Moderate (-9.9 to 0.0 C | 14.2 to 32.0 F)"
                },
                {
                    "level": 3,
                    "text": "Significant (-13.7 to -10.0 C | 7.3 to 14.0 F)"
                },
                {
                    "level": 4,
                    "text": "Frigid (-20.5 to -13.8 C | -4.9 to 7.2 F)"
                }
            ]
        },
        {
            "id": "ghost-orb",
            "name": "Ghost Orb",
            "identifyLabel": "Ghost Orb",
            "aliases": [
                "ghost orb",
                "ghost orbs",
                "orb",
                "orbs"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": true,
            "cleanseName": "Ghost Orb",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Mist (Faint cloud of energy)"
                },
                {
                    "level": 2,
                    "text": "Weak Orb (Hollow ring around an unstable core)"
                },
                {
                    "level": 3,
                    "text": "Strong Orb (Fully manifested orb with visible outer ring)"
                }
            ]
        },
        {
            "id": "radiation",
            "name": "Radiation",
            "identifyLabel": "Radiation",
            "aliases": [
                "radiation",
                "geiger",
                "rad"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": false,
            "cleanseName": "Radiation",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Minimal (100 to 500 CPM)"
                },
                {
                    "level": 2,
                    "text": "Moderate (501 to 1000 CPM)"
                },
                {
                    "level": 3,
                    "text": "Intense (1001 to 2000 CPM)"
                }
            ]
        },
        {
            "id": "uv",
            "name": "UV",
            "identifyLabel": "UV",
            "aliases": [
                "uv",
                "ultraviolet",
                "fingerprints"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": false,
            "cleanseName": "UV",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Faint Traces (Spray/Splotches)"
                },
                {
                    "level": 2,
                    "text": "Moderate Residues (Glowing Puddles)"
                },
                {
                    "level": 3,
                    "text": "Easily Identifiable Patterns (Clear Handprints)"
                }
            ]
        },
        {
            "id": "writing",
            "name": "Writing",
            "identifyLabel": "Writing",
            "aliases": [
                "writing",
                "book"
            ],
            "diminishingAllowed": true,
            "diminishingVerified": false,
            "cleanseName": "Writing",
            "cleanseLevels": [
                {
                    "level": 1,
                    "text": "Incomprehensible Scribbling (Chaotic)"
                },
                {
                    "level": 2,
                    "text": "Symbolic Enigmas (Shapes/Stars)"
                },
                {
                    "level": 3,
                    "text": "Hostile Manifestations (Threatening Words)"
                }
            ]
        }
    ],
    "behaviors": [
        {
            "id": "bspeed",
            "name": "Base Speed",
            "states": [
                "Slow",
                "Medium",
                "Fast"
            ]
        },
        {
            "id": "losspeed",
            "name": "LOS Speed",
            "states": [
                "Very Slow",
                "Slow",
                "Medium",
                "Fast",
                "Variable"
            ]
        },
        {
            "id": "losrange",
            "name": "LOS Range",
            "states": [
                "Near (15 m)",
                "Far (45 m)"
            ]
        },
        {
            "id": "holy",
            "name": "Holy Water",
            "states": [
                "None",
                "Low (3s)",
                "High (5s)"
            ]
        },
        {
            "id": "cooldown",
            "name": "Hunt Cooldown",
            "states": [
                "Short (40s)",
                "Medium (60s)",
                "Long (90s)"
            ]
        },
        {
            "id": "huntthreshold",
            "name": "Early Hunt",
            "states": [
                "Early Hunt (<100 BPM)"
            ]
        },
        {
            "id": "breaker",
            "name": "Main Breaker",
            "states": [
                "Can directly interact",
                "Cannot directly interact"
            ]
        },
        {
            "id": "indbreakerOn",
            "name": "Individual Breakers On",
            "states": [
                "Can turn on",
                "Cannot turn on"
            ]
        },
        {
            "id": "indbreakerOff",
            "name": "Individual Breakers Off",
            "states": [
                "Can turn off",
                "Cannot turn off"
            ]
        },
        {
            "id": "candleLight",
            "name": "Candle Light",
            "states": [
                "Can light",
                "Cannot light"
            ]
        },
        {
            "id": "candleExtinguish",
            "name": "Candle Extinguish",
            "states": [
                "Can extinguish",
                "Cannot extinguish"
            ]
        },
        {
            "id": "doors",
            "name": "Doors",
            "states": [
                "Can close / lock",
                "Cannot close / lock"
            ]
        },
        {
            "id": "flx",
            "name": "FLX-POD",
            "states": [
                "Can deactivate",
                "Cannot deactivate"
            ]
        },
        {
            "id": "lightsOn",
            "name": "Lights On",
            "states": [
                "Can turn on",
                "Cannot turn on"
            ]
        },
        {
            "id": "lightsOff",
            "name": "Lights Off",
            "states": [
                "Can turn off",
                "Cannot turn off"
            ]
        },
        {
            "id": "manifest",
            "name": "Manifest",
            "states": [
                "Full form possible",
                "Shadow only"
            ]
        },
        {
            "id": "radioOn",
            "name": "Radio On",
            "states": [
                "Can turn on",
                "Cannot turn on"
            ]
        },
        {
            "id": "radioOff",
            "name": "Radio Off",
            "states": [
                "Can turn off",
                "Cannot turn off"
            ]
        }
    ],
    "spiritBox": {
        "phrases": [
            "HELLO",
            "BE SEEN",
            "HEAR US",
            "MANIFEST",
            "TALK NOW",
            "KNOCK ONCE",
            "MAKE NOISE",
            "TOUCH THIS",
            "WE SEE YOU",
            "ARE YOU OLD",
            "SPEAK TO US",
            "WHO'S THERE",
            "ARE YOU HERE",
            "CAN YOU TALK",
            "DO SOMETHING",
            "MAKE A SOUND",
            "ARE YOU ANGRY",
            "ARE YOU CLOSE",
            "ARE YOU YOUNG",
            "SHOW STRENGTH",
            "WHERE ARE YOU",
            "SHALL WE LEAVE",
            "GIVE US A SIGN",
            "HOW DID YOU DIE",
            "HOW OLD ARE YOU",
            "REVEAL YOURSELF",
            "SHOULD WE LEAVE",
            "ARE YOU FRIENDLY",
            "WHAT DO YOU WANT",
            "WHY ARE YOU HERE",
            "IS THIS YOUR HOME",
            "DO YOU WANT US HERE",
            "IS THERE ANYONE HERE",
            "IS THERE A GHOST HERE",
            "WHAT IS YOUR LOCATION",
            "DO YOU WANT TO HURT US"
        ],
        "skiaUniqueResponses": [
            "“That wasn't very friendly.”",
            "“I don't want to hurt you.“",
            "“Don’t be sad, it will be over soon.”",
            "“Be nice. I don’t want to hurt you.”",
            "“Hm. I’m very sorry, dear stranger.”",
            "\"Shh. You have to be quiet.\"",
            "\"Skia cry\"",
            "\"I don't want to hurt you.\"",
            "\"Please, you should leave now.\"",
            "\"I'm sorry, she made me like this.\""
        ]
    },
    "mechanics": [
        {
            "id": "hunt-heartbeat",
            "title": "Hunt heartbeat",
            "text": "hearing a heartbeat during a hunt means the ghost sees you. Break line-of-sight and RUN!"
        },
        {
            "id": "stamina",
            "title": "Stamina",
            "text": "a full stamina sprint is about 11 steps. Avoid draining the bar completely because regeneration takes longer. A useful rhythm is roughly 10 steps, stop for 3–4 seconds, then sprint again. Revenant permanently reduces a targeted player's stamina by half for the remainder of the contract."
        },
        {
            "id": "electronics-during-hunts",
            "title": "Electronics during hunts",
            "text": "the cellphone, including its flashlight, can safely be used during a hunt. Turn off or drop other electronics you are carrying."
        },
        {
            "id": "favorite-room",
            "title": "Favorite room",
            "text": "ghosts have a favorite room, but evidence can appear elsewhere inside the location. The Infrasound Receiver must be in the favorite room to capture Audio evidence."
        },
        {
            "id": "cross",
            "title": "Cross",
            "text": "must be in the ghost's favorite room for it to interact with it."
        },
        {
            "id": "desecration",
            "title": "Desecration",
            "text": "desecrating the Cross can upset the ghost."
        },
        {
            "id": "hunt-heart-rate-threshold",
            "title": "Hunt heart-rate threshold",
            "text": "most ghosts can normally hunt at a 100 BPM average team heart rate. Demon, Hupia, and Wiederganger can hunt as early as 77 BPM. The threshold uses the average BPM of players inside the location."
        },
        {
            "id": "holy-water-hunt-blocks",
            "title": "Holy Water hunt blocks",
            "text": "special ghosts may temporarily replace their normal hunt cooldown after being sprayed. Demon and Wisp are blocked for 2 minutes; Tariaksuq is blocked for 90 seconds. Puca can imitate the Holy Water Effectiveness of the ghost it is copying during a hunt, so Holy Water Effectiveness alone does not rule Puca out. Check the ghost's Unique Behaviors for special Holy Water or cooldown rules."
        },
        {
            "id": "real-vs-diminishing-evidence",
            "title": "Real vs Diminishing Evidence",
            "text": "real evidence reappears several times at full strength. Diminishing evidence may first appear at full strength a couple of times, then appears weaker over time. Freezing can never be Diminishing."
        },
        {
            "id": "diminishing-filtering",
            "title": "Diminishing filtering",
            "text": "on limited-evidence runs, a Diminishing evidence type can also be one of the ghost's assigned evidence types, so it does not rule that ghost out. When the run has all 3 Real Evidence, extra Diminishing evidence can be treated as outside the ghost's three assigned evidence types."
        },
        {
            "id": "marid-evidence-exception",
            "title": "Marid evidence exception",
            "text": "Marid can add exactly 1 behavior-generated Diminishing evidence beyond the configured Diminishing limit. It can overlap one of Marid's assigned evidence types, cannot be Freezing, and can occur on 0 Real Evidence runs."
        },
        {
            "id": "forced-evidence",
            "title": "Forced Evidence",
            "text": "forced evidence applies whenever the run has Real Evidence, regardless of the configured Diminishing Evidence count. It does not apply on 0 Real Evidence runs."
        },
        {
            "id": "0-evidence-behavior-tells",
            "title": "0-evidence behavior tells",
            "text": "Bhoot can still cause its pre-hunt freezing-temperature behavior and Sluagh can still show Ghost Orbs on 0 Real Evidence runs. Treat those as special ghost behaviors rather than ordinary Real Evidence."
        },
        {
            "id": "ghost-orbs",
            "title": "Ghost Orbs",
            "text": "normally require infrared vision to see, but an orb can also be photographed using the cellphone camera flash. Sluagh can produce Orbs on 0 Real Evidence runs and has a 33% chance to show a cluster of 4 when displaying them."
        },
        {
            "id": "puca",
            "title": "Puca",
            "text": "imitates the full hunt behavior of another ghost, never passive behaviors. This includes Base Speed, LOS Speed, and Holy Water Effectiveness. Hunt LOS Range and Hunt Cooldown stay locked to Puca's own values. Forced-hunt behavior and Wiederganger's nearby anxiety-rate effect are not copied, and Puca cannot imitate the same ghost type back-to-back."
        },
        {
            "id": "candles",
            "title": "Candles",
            "text": "Can Light is a specific identifying behavior for Marid, Sluagh, Strigoi, and Wisp. Ghosts without that listed ability are treated as Cannot Light. Extinguishing remains an independent capability with its confirmed exception list."
        },
        {
            "id": "main-breaker",
            "title": "Main Breaker",
            "text": "Echo, Wewe Gombel, and Wisp cannot directly interact with it normally. Post-hunt breaker changes do not count. If too many lights overload the breaker, do not record that as ghost interaction."
        },
        {
            "id": "individual-breakers",
            "title": "Individual Breakers",
            "text": "these are the room-specific switches inside the breaker box. Wisp cannot interact with individual breakers. Echo and Wewe Gombel can only turn individual breakers off; every other ghost can turn individual breakers both on and off."
        },
        {
            "id": "radio-interactions",
            "title": "Radio interactions",
            "text": "TVs and alarm clocks do not count as Radio interactions. The Old Tape Recorder and Gramophone do count as Radio interactions."
        },
        {
            "id": "lights",
            "title": "Lights",
            "text": "a light exploding counts as the ghost turning a light off. Wisp can turn lights on but cannot turn them off. Players can also turn lights on, and too many active lights can trip/overload the main breaker; that resulting power loss is not a direct main-breaker interaction. Player illumination is dynamic, so being closer to active light sources provides more protection from anxiety than simply standing somewhere in a lit room."
        }
    ],
    "heartRateRanges": [
        "Normal: Anxiety 0% - 17% | Heart Rate 60 - 76 BPM | Hunt Chance 0%",
        "Anxious: Anxiety 17% - 40% | Heart Rate 77 - 99 BPM | Demon, Hupia, and Wiederganger can hunt | Hunt Chance 33%",
        "Panicked: Anxiety 40% - 70% | Heart Rate 100 - 129 BPM | All ghosts can hunt | Hunt Chance 33% - 50%",
        "Distressed: Anxiety 70% - 100% | Heart Rate 130 - 160 BPM | All ghosts can hunt | Hunt Chance 50% - 66%"
    ],
    "cleansing": {
        "fieldNotes": [
            {
                "title": "Investigation & Evidence",
                "items": [
                    "Goal: Find the ghost's characteristics (the highest evidence level for each type), not a ghost \"type\". Once a higher level is observed, lower readings can be ignored.",
                    "Listen for interactions anywhere, scan the item the ghost interacted with to find evidence.",
                    "Evidence can spawn anywhere, but becomes more common in the favorite room over time.",
                    "Favorite room will drop to the lowest temperature. Do not mistake cold spot evidence for base room temp.",
                    "Placing a Sanctified Cross in the favorite room may trigger an interaction (not guaranteed)."
                ]
            },
            {
                "title": "Affixer Commands",
                "items": [
                    "HELP: Information on how to use the device.",
                    "ADD: Adds an evidence type and level (ex. ADD EMF 3). To update a level, simply use ADD again with the new level.",
                    "REMOVE: Clears an evidence entry from the Affixer and includes the level currently entered (ex. REMOVE UV 2).",
                    "INFO: Gets info about a specific evidence without needing the level (ex. INFO WRITING).",
                    "SCAN: Begins the scanning process."
                ]
            },
            {
                "title": "Scan Status Colors",
                "items": [
                    "Blue: Stationary: Normal. Awaiting input.",
                    "Blue: Rotating: Scanning.",
                    "Yellow: Loss of proximity personnel. 1 team member must remain within 16 feet/5 meters. Check range when placing the affixer.",
                    "Red: Failed scan. This status immediately starts a hunt.",
                    "Green: Successful scan."
                ]
            },
            {
                "title": "System, Logic & Cleansing",
                "items": [
                    "Battery: Each scan uses battery power. Charge device at your vehicle when battery is too low to scan again.",
                    "E.A.L. (Buzz-Stick): Use after a successful scan. It glows brighter when close to an artifact, and flashes when very close.",
                    "Completion: Find all artifacts to cleanse the ghost, or take the Optional Exit after a successful scan for a partial reward."
                ]
            }
        ]
    },
    "locations": [
        "St. Joseph's Orphanage",
        "Abaddon Hallows West",
        "Abaddon Hallows East",
        "Abaddon Hallows East (P)",
        "Summerhill Psychiatric",
        "Stone Manor Plantation",
        "317 Aspen Heights",
        "1205 Cedar Street",
        "12 Ravenwood Lane",
        "Blackmeadow",
        "The McGavin House"
    ],
    "specialReferences": {
        "iblisShapeshifting": [
            "St. Joseph’s Orphanage (Henry) Normal model: Dirty face, white eyes and red eye bags, dirty plaid baby blue shirt, dark gray Scottish overalls, dark blue knee socks and brown leather shoes. Shapeshift cosmetics: Clean face, blue eyes, clean plaid baby blue shirt, dark gray Scottish overalls, dark blue knee socks and brown leather shoes.",
            "Abaddon Hallows (Abigail) Only ghost model that has only 1 change. Normal model: Black habit and white collar. Shapeshift cosmetics: Red habit and black collar.",
            "Summerhill Psychiatric Institution (Stevie) Normal model: White straight jacket dress, with brown leather belts. Shapeshift cosmetics: Black straight jacket dress, with red leather belts // Red straight jacket dress, with black leather belts.",
            "Stone Manor Plantation (Victoria) Normal model: Dark purple flower crown, black dress, veiny décolleté and black mesh fingerless gloves. Shapeshift cosmetics: Red flower crown, red hair tips, bloody mouth, red ruffles on a black dress, translucent mesh fingerless gloves and red shoes // White flower crown, bloody mouth, white dress, white mesh fingerless gloves and white shoes.",
            "317 Aspen Heights (Jennifer) Normal model: Black hair, black jacket, white crop top, cropped 3/4 white gym pants and black sneakers. Gray face, eyes and lips. Shapeshift cosmetics: Red hair, red jacket, red top, cropped 3/4 pink gym pants and red shoelaces // Red hair, blue jacket, blue top, cropped 3/4 gray gym pants and blue shoelaces",
            "1205 Cedar Street (Jebediah) Normal model: White t-shirt and dark blue pants and bloody mouth and cheeks. Shapeshift cosmetics: White tank top with dark pants, bloody elbows and left mouth side showing teeth // Striped gray shirt and dark pants, bloody right eye and chest area.",
            "12 Ravenwood Lane (Gary) Normal model: White polka dot jester hat and pants, with white face makeup, bloody spots on face, arms and upper body. Shapeshift cosmetics: Green jester hat and green plaid pants, with different makeup // Beige polka dot jester hat and pants, with no makeup."
        ]
    },
    "pmsStats": {
        "gameRules": {
            "maxRealEvidence": 3,
            "maxFalseEvidence": 2,
            "heartRate": {
                "demonThreshold": 77,
                "allGhostThreshold": 100,
                "distressedThreshold": 130,
                "maxInput": 200
            }
        },
        "speedConfig": {
            "base": {
                "Slow": {
                    "label": "Slow",
                    "cmps": 242
                },
                "Medium": {
                    "label": "Medium",
                    "cmps": 260
                },
                "Fast": {
                    "label": "Fast",
                    "cmps": 310
                }
            },
            "los": {
                "Very Slow": {
                    "label": "Very Slow",
                    "cmps": 200
                },
                "Slow": {
                    "label": "Slow",
                    "cmps": 242
                },
                "Medium": {
                    "label": "Medium",
                    "cmps": 270
                },
                "Fast": {
                    "label": "Fast",
                    "cmps": 310
                }
            },
            "losRangeMeters": {
                "Near": 15,
                "Far": 45
            },
            "cooldownSeconds": {
                "Short": 40,
                "Medium": 60,
                "Long": 90
            },
            "holySeconds": {
                "None": null,
                "Low": 3,
                "High": 5
            }
        }
    }
};
