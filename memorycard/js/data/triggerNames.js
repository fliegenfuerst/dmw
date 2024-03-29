const triggerNames = [
`Inventory is full`,
`Makes a fight non runnable`,
`Disables all battle commands`,
`Inventory is empty`,
`Used in the secret card shop`,
`Mojyamon #1, Digimushrm traded`,
`Mojyamon #1, Supercarrot traded`,
`Mojyamon #1, Happymushrm traded`,
`Mojyamon #2, Giant Meat traded`,
`Mojyamon #2, Black trout traded`,
`Mojyamon #2, Hispeed disk traded`,
`Mojyamon #3, Omnipotent traded`,
`Mojyamon #3, med.recovery traded`,
`Mojyamon #3, Digianchovy traded`,
`-`,
`D-Rank Cup won`,
`C-Rank Cup won`,
`B-Rank Cup won`,
`A-Rank Cup won`,
`S-Rank Cup won`,
`R-Rank Cup won`,
`Version 1 Cup won`,
`Version 2 Cup won`,
`Version 3 Cup won`,
`Version 4 Cup won`,
`Version 0 Cup won`,
`Fire Cup won`,
`Battle Cup won`,
`Air Cup won`,
`Ice Cup won`,
`Earth Cup won`,
`Mech Cup won`,
`Filth Cup won`,
`Dino Cup won`,
`Wing Cup won`,
`Animal Cup won`,
`Human Cup won`,
`Signed in to an Arena Cup`,
`-`,
`-`,
`Signed in to underleveled Arena Cup`,
`Lost a life in battle`,
`-`,
`Returned after beating the game`,
`Talked to the hungry Kunemon`,
`Unlocked Old Fishrod`,
`Unlocked Amazing Rod`,
`Unlocked Inventory Addon #1`,
`Unlocked Inventory Addon #2`,
`Cannot cancel selection`,
`Beaten the game once already`,
`Talked to Agumon at the bank already`,
`Talked to Betamon/Coelamon at their shop`,
`Talked to Centarumon in the clinic already`,
`Debug Mode disabled`,
`Intro cutscene did not play yet`,
`Got starting items from Tokomon`,
`-`,
`Talked to Meramon in the restaurant already`,
`Talked to Frigimon in the restaurant already`,
`Talked to Garurumon in the restaurant already`,
`Talked to Tyrannomon in the restaurant already`,
`-`,
`-`,
`Talked to Giromon in the restaurant already`,
`Talked to Patamon in the shop`,
`Talked to Biyomon in the shop`,
`Talked to Unimon in the shop`,
`Talked to Monochromon in the shop`,
`Can talk with Piximon in the shop`,
`Talked to Numemon in the secret shop `,
`Talked to Mojyamon in the secret shop`,
`Talked to Mamemon in the secret shop`,
`Talked to Devimon in the secret shop`,
`Talked to Tanemon at the meat farm already`,
`Unreachable debug thing`,
`Rain Plant has been harvested`,
`Talked to Bakemon in File City already`,
`Talked to Shellmon in File City already`,
`Talked to Kunemon in File City already`,
`Talked to Elecmon in File City already`,
`Talked to Angemon in Jijimon's house already`,
`Talked to Palmon in File City already`,
`Talked to Whamon in File City already`,
`Talked to Kokatorimon in File City already`,
`-`,
`Talked with Tanemon about the strange plant`,
`Will get ambushed by Greymon in File City`,
`Beaten Airdramon in the ambush`,
`Talked to Birdramon in File City already`,
`Talked to Drimogemon in File City already`,
`Talked to Greymon at the arena already`,
`Talked to Penguinmon in file city already`,
`Talked to Airdramon at the arena already`,
`Talked with Jijimon about the saving machine`,
`Talked w. Coela & Beta about their collaboration`,
`Walked over Coelamon's head once`,
`Beaten Saberdramon at end of Bone Tunnel`,
`Has entered Ogremon screen from above`,
`-`,
`Read the note in Myotismon's fridge`,
`First part of your shift at Monochromon done`,
`-`,
`Walked over the invisible bridge already`,
`Myotismon told you that you lost his fridge key`,
`"Got the text remarking the Landslide cleared"`,
`Landslide blocking path to Unimon cleared`,
`Mojyamon #1 despawned`,
`Mojyamon #2 despawned`,
`Mojyamon #3 despawned`,
`Mansion Key despawned`,
`Used Mansion key to open dining room`,
`Have not been to Misty Trees yet`,
`Used Mansion key to open dining room`,
`Misty Trees enemies updated`,
`Used Mansion key to open stairs to attic`,
`You don't know about the Monzaemon costume`,
`Opened the door at Myotismon's office`,
`Spotted Vademons circles`,
`-`,
`Lava Cave opened`,
`Already entered the mansion once`,
`ShogunGekomon can be traded with`,
`Used Mansion key to open Brain Chips room`,
`Yuramon told you about the Invisible Bridge`,
`Used Mansion key to open the Library`,
`Back Exit for Drill Tunnel opened`,
`Used Mansion key to open east fireplace`,
`Saved Myotismon from starving`,
`Talked to Myotismon after beating Skullgreymon`,
`Beaten Tekkamon in the Secret Lab`,
`Fell for the book trap in the mansion`,
`Fell into Myotismon's office`,
`Talked to Frigimon`,
`Entered Leomons cave`,
`Picked up Leomons stone tablet`,
`Talked to Monochromon at his original shop`,
`Got warned from Centarumon for trespassing`,
`-`,
`Talked to the secret card shop`,
`Beaten Kitchen Drimogemon`,
`Checked the cliff already`,
`Fell down the cliff at Ogremon #1 screen`,
`Didn't re-enter after checking the cliff yet`,
`Defeated Tyrannomon`,
`-`,
`-`,
`Misty Trees warp enabled`,
`Misty Trees fog removed`,
`Drill Tunnel has been spotted`,
`Beaten Ogremon #3`,
`Spotted the altered Drill Tunnel sign`,
`Read about the UFO sighting in the news`,
`Read about Vademon being seen in the news`,
`You found even more circles from Vademon`,
`Rock removed from the elevator`,
`-`,
`-`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Amida Forest progress`,
`Visited Kokatorimon's map on time once`,
`Beat Ogremon #2`,
`Can use Ogremon's elevator`,
`-`,
`Treasure Hunt 3 Day Tour ongoing`,
`Treasure Hunt 10 Day Tour ongoing`,
`Shellmon's island is elevated`,
`Shellmon's island is down again`,
`Talked with Shellmon about the elevator problem`,
`-`,
`-`,
`Spotted the repaired bridge`,
`Talked to the Vegimon plant in the jungle`,
`Path to Speedy Time Zone opened`,
`Ancient Dino Region Warp enabled`,
`Talked to Leomon in his camp`,
`Gear Savanna Warp enabled`,
`Something about waiting for Biyomon`,
`Something about waiting for Biyomon`,
`Something about waiting for Biyomon`,
`Something about waiting for Biyomon`,
`Promised Garurumon a fight tomorrow`,
`Watched Leomon play hero`,
`Heard about Ogremon from Yuramon`,
`Defeated Ogremon #1`,
`Talked to guard Agumon at Ogre Fortress`,
`Entrance to Ogre Fortress opened`,
`Back Dimension Quest started`,
`Defeated the 2nd Machinedramon`,
`Agumon recruited`,
`Betamon recruited`,
`Greymon recruited`,
`Devimon recruited`,
`Airdramon recruited`,
`Tyrannomon recruited`,
`Meramon recruited`,
`Seadramon recruited`,
`Numemon recruited`,
`MetalGreymon recruited`,
`Mamemon recruited`,
`Monzaemon recruited`,
`Obtained the Chained Melon`,
`100pp completed`,
`Gabumon recruited`,
`Elecmon recruited`,
`Kabuterimon recruited`,
`Angemon recruited`,
`Birdramon recruited`,
`Garurumon recruited`,
`Frigimon recruited`,
`Whamon recruited`,
`Vegiemon recruited`,
`SkullGreymon recruited`,
`MetalMamemon recruited`,
`Vademon recruited`,
`Didn't give Unimon a healing item`,
`Watched Meramon's cutscene`,
`Patamon recruited`,
`Kunemon recruited`,
`Unimon recruited`,
`Ogremon recruited`,
`Shellmon recruited`,
`Centarumon recruited`,
`Bakemon recruited`,
`Drimogemon recruited`,
`Sukamon recruited`,
`Andromon recruited`,
`Giromon recruited`,
`Etemon recruited`,
`Defeated the 2nd Machinedramon`,
`-`,
`Biyomon recruited`,
`Palmon recruited`,
`Monochromon recruited`,
`Leomon recruited`,
`Coelamon recruited`,
`Kokatorimon recruited`,
`Kuwagamon recruited`,
`Mojyamon recruited`,
`Nanimon recruited`,
`Megadramon recruited`,
`Piximon recruited`,
`Digitamamon recruited`,
`Penguinmon recruited`,
`Ninjamon recruited`,
`Phoenixmon unlocked for Arena`,
`H-Kabuterimon unlocked for Arena`,
`MegaSeadramon unlocked for Arena`,
`-`,
`-`,
`-`,
`-`,
`Myotismon unlocked for Arena`,
`Yanmamon beaten`,
`Gotsumon beaten`,
`Flarerizamon beaten`,
`WaruMonzaemon beaten`,
`SnowAgumon beaten`,
`Hyogamon beaten`,
`PlatinumSukamon beaten`,
`Dokunemon beaten`,
`ShimaUnimon beaten`,
`Tankmon beaten`,
`RedVegiemon beaten`,
`J-Mojyamon beaten`,
`NiseDrimogemon beaten`,
`Goburimon beaten`,
`MudFrigimon beaten`,
`Psychemon beaten`,
`ModokiBetamon beaten`,
`ToyAgumon beaten`,
`Piddomon beaten`,
`Aruraumon beaten`,
`Geremon beaten`,
`Vermilimon beaten`,
`Fugamon beaten`,
`Tekkamon beaten`,
`MoriShellmon beaten`,
`Guardromon beaten`,
`Muchomon beaten`,
`Icemon beaten`,
`Akatorimon beaten`,
`Tsukaimon beaten`,
`Sharmamon beaten`,
`ClearAgumon beaten`,
`Weedmon beaten`,
`IceDevimon beaten`,
`Darkrizamon beaten`,
`SandYanmamon beaten`,
`SnowGoburimon beaten`,
`BlueMeramon beaten`,
`Gururumon beaten`,
`Saberdramon beaten`,
`Soulmon beaten`,
`Rockmon beaten`,
`Otamamon beaten`,
`Gekomon beaten`,
`Tentomon beaten`,
`WaruSeadramon beaten`,
`Meteormon beaten`,
`-`,
`-`,
`-`,
`-`,
`-`,
`Path to Volume Villa has been opened`,
`Old Fishrod despawned`,
`Devimon defeated in Mt. Infinity`,
`Angemon recruitable, stepped into the light`,
`Secret door in Ice Sanctuary unlocked`,
`Checked out the Angemon statue`,
`Read in the news that Myotismon is fine`,
`Metalgreymon defeated in Mt. Infinity`,
`-`,
`Factorial Town (Savanna) entrance opened`,
`Andromon data repair complete`,
`Andromon exposition dump done`,
`Guard Change info obtained`,
`Factorial Town entrance open`,
`Talked to Nanimon in Leomon's Ancestor Cave`,
`Talked to Nanimon in Ogremon's Hideout`,
`Talked to Nanimon in Ancient Speedy Region`,
`Talked to Nanimon in Sewers`,
`Talked to Nanimon in Toy Town`,
`Disable Leomon cutscene trigger`,
`Fished Seadramon once`,
`Noticed the fog in the Sewers`,
`Talked to Andromon after beating Giromon`,
`Talked to Numemon in the Sewers`,
`Talked to Andromon before solving the incident`,
`Beaten Giromon`,
`Beaten SkullGreymon`,
`Won the Beetle Cup`,
`Guardromon explained that you need a permit`,
`Steak spawns in Overdell Cemetery`,
`Toy Mansion unlocked`,
`Toy Town is back to normal`,
`Freezeland Warp enabled`,
`Talked to Whamon in Freeze Land`,
`Talked to Drimogemon (at Cave Exit)`,
`Mt. Infinity unlocked`,
`Airdramons rests in the back of Jijimon's house`,
`Myotismon's disappearance quest enabled`,
`Used up your one free curling match`,
`You notice Myotismon is gone`,
`You didn't find Myotismon in his bed`,
`Met Devimon at the Mansion`,
`-`,
`You know King Sukamons ability`,
`Turned back from Sukamon first time`,
`Grade Cup Medal unlocked`,
`Version Cup Medal unlocked`,
`Type Cup Medal unlocked`,
`Special Cup Medal unlocked`,
`100 Cup Wins Medal unlocked`,
`All Techniques Medal unlocked`,
`All Digimon Medal unlocked`,
`Max Stats Medal unlocked`,
`Perfect Curling Medal unlocked`,
`100 Fish Medal unlocked`,
`Watched Ending Medal unlocked`,
`100pp Medal unlocked`,
`All Cards Medal unlocked`,
`Max Money Medal unlocked`,
`10 Years Medal unlocked`,
`-`,
`-`,
`-`,
`-`,
`-`,
`sm. recovery buyable in shop`,
`med. recovery buyable in shop`,
`lrg. recovery buyable in shop`,
`sup. recovery buyable in shop`,
`MP Floppy buyable in shop`,
`Medium MP buyable in shop`,
`Large MP buyable in shop`,
`Double floppy buyable in shop`,
`Various buyable in shop`,
`Omnipotent buyable in shop`,
`Protection buyable in shop`,
`Restore buyable in shop`,
`Sup. restore buyable in shop`,
`Bandage buyable in shop`,
`Medicine buyable in shop`,
`Off. Disk buyable in shop`,
`Def. Disk buyable in shop`,
`Hispeed Disk buyable in shop`,
`Omni Disk buyable in shop`,
`S. Off. Disk buyable in shop`,
`S. Def. Disk buyable in shop`,
`S. Speed. Disk buyable in shop`,
`Autopilot buyable in shop`,
`Off. Chip buyable in shop`,
`Def. Chip buyable in shop`,
`Brain Chip buyable in shop`,
`Quick Chip buyable in shop`,
`HP Chip buyable in shop`,
`MP Chip buyable in shop`,
`DV Chip A buyable in shop`,
`DV Chip D buyable in shop`,
`DV Chip E buyable in shop`,
`Port. potty buyable in shop`,
`Trn. manual buyable in shop`,
`Rest pillow buyable in shop`,
`Enemy repel buyable in shop`,
`Enemy bell buyable in shop`,
`Health shoe buyable in shop`,
`Meat buyable in shop`,
`Giant Meat buyable in shop`,
`Sirloin buyable in shop`,
`Supercarrot buyable in shop`,
`Hawk radish buyable in shop`,
`Spiny green buyable in shop`,
`Digimushroom buyable in shop`,
`Ice Mushroom buyable in shop`,
`Deleuxmushroom buyable in shop`,
`Digipine buyable in shop`,
`Blue apple buyable in shop`,
`Red Berry buyable in shop`,
`Gold Acorn buyable in shop`,
`Big Berry buyable in shop`,
`Sweet Nut buyable in shop`,
`Super veggy buyable in shop`,
`Pricklypear buyable in shop`,
`Orange banana buyable in shop`,
`Power Fruit buyable in shop`,
`Power Ice buyable in shop`,
`Speed Leaf buyable in shop`,
`Sage Fruit buyable in shop`,
`Muscle Yam buyable in shop`,
`Calm Berry buyable in shop`,
`Digianchovy buyable in shop`,
`Digisnapper buyable in shop`,
`DigiTrout buyable in shop`,
`Black trout buyable in shop`,
`Digicatfish buyable in shop`,
`Digiseabass buyable in shop`,
`Moldy Meat buyable in shop`,
`Happymushroom buyable in shop`,
`Chain Melon buyable in shop`,
`Grey Claws buyable in shop`,
`Fireball buyable in shop`,
`Flamingwing buyable in shop`,
`Iron Hoof buyable in shop`,
`Mono Stone buyable in shop`,
`Steel Drill buyable in shop`,
`White Fang buyable in shop`,
`Black Wing buyable in shop`,
`Spike Club buyable in shop`,
`Flamingmane buyable in shop`,
`White Wing buyable in shop`,
`Torn Tatter buyable in shop`,
`Electro Ring buyable in shop`,
`Rainbowhorn buyable in shop`,
`Rooster buyable in shop`,
`Unihorn buyable in shop`,
`Horn Helmet buyable in shop`,
`Scissor Jaw buyable in shop`,
`Fertilizer buyable in shop`,
`Koga Laws buyable in shop`,
`Waterbottle buyable in shop`,
`North Star buyable in shop`,
`Red Shell buyable in shop`,
`Hard Scale buyable in shop`,
`Bluecrystal buyable in shop`,
`Ice crystal buyable in shop`,
`Hair Grower buyable in shop`,
`Sunglasses buyable in shop`,
`Metal Part buyable in shop`,
`Fatal Bone buyable in shop`,
`Cyber Part buyable in shop`,
`Mega Hand buyable in shop`,
`Silver Ball buyable in shop`,
`Metal Armor buyable in shop`,
`Chainsaw buyable in shop`,
`Small Spear buyable in shop`,
`X Bandage buyable in shop`,
`Ray Gun buyable in shop`,
`Gold Banana buyable in shop`,
`Mysty Egg buyable in shop`,
`Red Ruby buyable in shop`,
`Beetlepearl buyable in shop`,
`Coral Charm buyable in shop`,
`Moon Mirror buyable in shop`,
`Blue Flute buyable in shop`,
`old fishrod buyable in shop`,
`Amazing Rod buyable in shop`,
`Leomonstone buyable in shop`,
`Mansion Key buyable in shop`,
`Gear buyable in shop`,
`Rain Plant buyable in shop`,
`Steak buyable in shop`,
`Frig Key buyable in shop`,
`AS Decoder buyable in shop`,
`Giga Hand buyable in shop`,
`Noble Mane buyable in shop`,
`MetalBanana buyable in shop`,
`-`,
`Botamon trained`,
`Koromon trained`,
`Agumon trained`,
`Betamon trained`,
`Greymon trained`,
`Devimon trained`,
`Airdramon trained`,
`Tyrannomon trained`,
`Meramon trained`,
`Seadramon trained`,
`Numemon trained`,
`MetalGreymon trained`,
`Mamemon trained`,
`Monzaemon trained`,
`Punimon trained`,
`Tsunomon trained`,
`Gabumon trained`,
`Elecmon trained`,
`Kabuterimon trained`,
`Angemon trained`,
`Birdramon trained`,
`Garurumon trained`,
`Frigimon trained`,
`Whamon trained`,
`Vegiemon trained`,
`SkullGreymon trained`,
`MetalMamemon trained`,
`Vademon trained`,
`Poyomon trained`,
`Tokomon trained`,
`Patamon trained`,
`Kunemon trained`,
`Unimon trained`,
`Ogremon trained`,
`Shellmon trained`,
`Centarumon trained`,
`Bakemon trained`,
`Drimogemon trained`,
`Sukamon trained`,
`Andromon trained`,
`Giromon trained`,
`Etemon trained`,
`Yuramon trained`,
`Tanemon trained`,
`Biyomon trained`,
`Palmon trained`,
`Monochromon trained`,
`Leomon trained`,
`Coelamon trained`,
`Kokatorimon trained`,
`Kuwagamon trained`,
`Mojyamon trained`,
`Nanimon trained`,
`Megadramon trained`,
`Piximon trained`,
`Digitamamon trained`,
`Penguinmon trained`,
`Ninjamon trained`,
`Phoenixmon trained`,
`H-Kabuterimon trained`,
`MegaSeadramon trained`,
`-`,
`Talked with Jiji about Agumon`,
`Talked with Jiji about Betamon`,
`Talked with Jiji about Greymon`,
`Talked with Jiji about Devimon`,
`Talked with Jiji about Airdramon`,
`Talked with Jiji about Tyrannomon / Elecmon`,
`Talked with Jiji about Meramon / Kabuterimon`,
`-`,
`Talked with Jiji about Numemon`,
`Talked with Jiji about MetalGreymon`,
`-`,
`-`,
`Talked with Jiji about Mamemon`,
`Talked with Jiji about Monochromon`,
`Talked with Jiji about Gabumon`,
`-`,
`-`,
`Talked with Jiji about Angemon`,
`Talked with Jiji about Birdramon`,
`Talked with Jiji about Garurumon`,
`Talked with Jiji about Frigimon`,
`Talked with Jiji about Whamon`,
`Talked with Jiji about Vegiemon`,
`Talked with Jiji about SkullGreymon`,
`Talked with Jiji about MetalMamemon`,
`Talked with Jiji about Vademon`,
`Talked with Jiji about Patamon`,
`Talked with Jiji about Kunemon`,
`Talked with Jiji about Unimon`,
`Talked with Jiji about Ogremon`,
`Talked with Jiji about Shellmon`,
`Talked with Jiji about Centarumon`,
`Talked with Jiji about Bakemon`,
`Talked with Jiji about Drimogemon`,
`.`,
`Talked with Jiji about Andromon`,
`Talked with Jiji about Giromon`,
`Talked with Jiji about Etemon`,
`Talked with Jiji about Biyomon`,
`Talked with Jiji about Palmon`,
`Talked with Jiji about Monzaemon`,
`Talked with Jiji about Leomon`,
`Talked with Jiji about Coelamon`,
`Talked with Jiji about Kokatorimon`,
`Talked with Jiji about Kuwagamon`,
`Talked with Jiji about Mojyamon`,
`Talked with Jiji about Nanimon`,
`-`,
`Talked with Jiji about Piximon`,
`Talked with Jiji about Digitamamon`,
`Talked with Jiji about Penguinmon`,
`Talked with Jiji about Ninjamon`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`Digimon "fullness" was >= a fixed value once`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`Chest containing MP Chip on YAKA02.`,
`Chest containing Restore on YAKA02.`,
`Chest containing Auto Pilot on YAKA02.`,
`Chest containing Sirloin on YAKA14.`,
`Chest containing Brain Chip on YAKA17.`,
`Chest containing Brain Chip on YAKA17.`,
`Chest containing Medicine on YAKA23.`,
`Chest containing Restore on ICSA02.`,
`Chest containing Off. Chip on TUNN10.`,
`Chest containing Quick Chip on TUNN10.`,
`Chest containing sup.recovery on ICSA06.`,
`Chest containing Large MP on ICSA06.`,
`Chest containing Omni Disk on ICSA07.`,
`Chest containing Omnipotent on ICSA07.`,
`Chest containing lrg.recovery on ICSA02.`,
`Chest containing Medicine on ICSA05.`,
`Chest containing Def. Chip on GCAN04/GCAN04_2.`,
`Chest containing Off. Chip on LEOM02.`,
`Chest containing HP Chip on OMOC08.`,
`Chest containing Double flop on OGRE00.`,
`Chest containing Auto Pilot on OGRE01.`,
`Chest containing Port. potty on OGRE03.`,
`Chest containing Mysty Egg on OGRE11.`,
`Chest containing S.Off.disk on OGRE04.`,
`Chest containing Sirloin on OGRE04.`,
`Chest containing Off. Chip on OGRE04.`,
`Chest containing Protection on TUNN07_3.`,
`Chest containing HP Chip on FACT09.`,
`Chest containing MP Chip on FACT09.`,
`Chest containing S.Def.disk on TUNN08_3.`,
`Chest containing Omni Disk on MGEN01.`,
`Chest containing Large MP on MGEN02.`,
`Chest containing Omnipotent on MGEN03.`,
`Chest containing Def. Chip on OGRE04.`,
`Chest containing Large MP on MGEN04.`,
`Chest containing MP Chip on MGEN05.`,
`Chest containing Sirloin on MGEN06.`,
`Chest containing Auto Pilot on MGEN07.`,
`Chest containing Double flop on MGEN08.`,
`Chest containing sup.recovery on MGEN09.`,
`Chest containing HP Chip on MGEN10.`,
`Chest containing MP Chip on MGEN10.`,
`-`,
`Chest containing med.recovery on TROP01.`,
`Chest containing Off. Chip on TUNN08/TUNN08_2.`,
`Chest containing Medicine on TUNN08/TUNN08_2.`,
`Chest containing med.recovery on MIHA03/MIHA06.`,
`Chest containing Medium MP on MIHA03/MIHA06.`,
`Chest containing Various on MIHA03/MIHA06.`,
`-`,
`Chest containing Medicine on YAKA25.`,
`Chest containing Def. Disk on YAKA25.`,
`Chest containing Protection on YAKA25.`,
`Chest containing Large MP on YAKA25.`,
`Chest containing Omni Disk on YAKA12.`,
`Chest containing Auto Pilot on YAKA12.`,
`Chest containing Medium MP on MAYO10.`,
`Chest containing Ray Gun on MGEN11.`,
`Chest containing Quick Chip on MGEN12.`,
`Chest containing MP Chip on MGEN12.`,
`Chest containing Def. Chip on MGEN12.`,
`Chest containing Brain Chip on MGEN12.`,
`Chest containing Off. Chip on MGEN13.`,
`Chest containing HP Chip on MGEN13.`,
`Chest containing Def. Chip on FACT10.`,
`Chest containing Auto Pilot on FACT10.`,
`Chest containing Brain Chip on FACT10.`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`,
`-`
];