from collections import Counter
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

str1 = "Astrophysics is the branch of astronomy that employs the principles of physics and chemistry to ascertain the nature of the astronomical objects, rather than their positions or motions in space.[1][2] Among the objects studied are the Sun, other stars, galaxies, extrasolar planets, the interstellar medium and the cosmic microwave background.[3][4] Emissions from these objects are examined across all parts of the electromagnetic spectrum, and the properties examined include luminosity, density, temperature, and chemical composition. Because astrophysics is a very broad subject, astrophysicists apply concepts and methods from many disciplines of physics, including classical mechanics, electromagnetism, statistical mechanics, thermodynamics, quantum mechanics, relativity, nuclear and particle physics, and atomic and molecular physics."
str2 = "English studies (usually called simply English) is an academic discipline taught in primary, secondary, and post-secondary education in English-speaking countries; it is not to be confused with English taught as a foreign language, which is a distinct discipline. English includes: the study of literature written in the English language (especially novels, short stories, and poetry), the majority of which comes from Britain, the United States, and Ireland (although English-language literature from any country may be studied, and local or national literature is usually emphasized in any given country); English composition, including writing essays, short stories, and poetry; English language arts, including the study of grammar, usage, and style; and English sociolinguistics, including discourse analysis of written and spoken texts in the English language, the history of the English language, English language learning and teaching, and the study of World Englishes. English linguistics (syntax, morphology, phonetics, phonology, etc.) is usually treated as a distinct discipline, taught in a department of linguistics."
str3 = "Life's purpose is to reproduce but life's meaning is much more vague."

punctuations = '''!()-[]{};:'"\,<>./?@#$%^&*_~1234567890'''

def genFreq(string):
    string = string.lower()
    no_punct = ""
    for char in string:
        if char not in punctuations:
            no_punct = no_punct + char
    string = no_punct.split()
    termFreqDict = {}
    for word in string:
        if word in termFreqDict:
            termFreqDict[word] +=1
        else:
            termFreqDict[word] = 1
    return termFreqDict

def chartFreq(dict1, dict2):
    allDict = {} 
    for key in dict1:
        allDict[key][0] = dict1[key]
    for key in dict2:
        if key in allDict:
            allDict[key][1] = dict2[key]
        else:
            allDict[key][0] = 0
            allDict[key][1] = dict2[key]

# allDict structure should use word in string as key and a list as value with list having two items, the integer amount of times the word appears in both strings

    return allDict

    # dict1Keys = []
    # dict2Keys = []
    # for key in dict1:
    #     dict1Keys.append(key)
    # for key in dict2:
    #     dict2Keys.append(key)
    # allWords =
    # for i in allWords:
    #     allDict[i] = [dict1[i], dict2[i]]
    # return commonDict

def genSim(allDict):
    dict1Norm = 0
    dict2Norm = 0
    sim = 0
    for key in allDict:
        dict1Norm += float((allDict[key][0]))**2 #need error resolution
        dict2Norm += float((allDict[key][1]))**2
    for key in allDict:
        allDict[key][0] = float((allDict[key][0]))/dict1Norm
        allDict[key][1] = float((allDict[key][1]))/dict2Norm
    for key in allDict:
        sim += (float(allDict[key][0])*float(allDict[key][1]))
    return sim

    #common words
    #list

print(genSim(chartFreq(genFreq(str1), genFreq(str2))))
