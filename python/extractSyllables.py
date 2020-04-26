import pyphen
import csv

pyphen.language_fallback('it_IT')
engine = pyphen.Pyphen(lang='it_IT')

syllables = set()
syllableCount = dict()
syllablesLen = 0
uniqueWords = set()

with open('dicts/it.csv') as dictionary:
    for idx, word in enumerate(dictionary):
        uniqueWords.add(word)
        currentSylls = engine.inserted(word).split('-')
        for s in currentSylls:
            s = s.strip('\n')
            if len(s) >= 1 and len(s) <= 3:
                syllables.add(s)
                if len(syllables) == syllablesLen:
                    # sillaba non inserita, duplicato
                    syllableCount[s] += 1
                else:
                    # prima volta che inserisco la sillaba
                    syllableCount[s] = 1
                syllablesLen = len(syllables)

minOccurences = min(syllableCount.values())
avg = sum(syllableCount.values()) / len(syllableCount)
maxOccurences = max(syllableCount.values())


with open('res/it.csv', mode='w') as resultFile:
    writer = csv.writer(resultFile)
    for s in syllables:
        occurences = syllableCount[s]
        difficolty = 5 - round(((occurences * 5 / (avg + 1000)) % 5), 2)
        if difficolty < 4.6:
            writer.writerow([s, difficolty])

with open('res/it_unique.txt', mode='w') as uniqueFile:
    for s in uniqueWords:
        uniqueFile.write(s)
