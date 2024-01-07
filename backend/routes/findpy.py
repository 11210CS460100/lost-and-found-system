from sentence_transformers import SentenceTransformer, util
import sys
import json


param1 = sys.argv[1]
param2 = sys.argv[2]
param3 = sys.argv[3]

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


delimiters = [",", "[", "]"]
 
for delimiter in delimiters:
    param1 = " ".join(param1.split(delimiter))
 
param1_list = param1.split()
for i in range(len(param1_list)):
    param1_list[i] = float(param1_list[i])
#print(param1_list)


#Compute embedding for all sentence, to build up a dictionary for further search
#in our application, we can embed the sentence as the document been uploaded
vector = (model.encode(param3, convert_to_tensor=True))

highest_score = 0
index = 0
#compare the wanted query with all the other embedding in the dictionary
'''
for i in range(len(param1_list)):
    score = (util.pytorch_cos_sim(vector, param1_list[i+1]))
    if score > highest_score:
        index = i
        highest_score = score
'''

param2 = param2.split(",")
print(param2[index]) #convert tensor -> list -> json string
sys.stdout.flush() # remeber to call this. or nothing will be passed to JS
    