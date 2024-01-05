from sentence_transformers import SentenceTransformer, util
import sys




sentences = ["I'm happy", "I'm full of happiness","I like that happy dog!", "I'm a dog"] 

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

embedding = []
#Compute embedding for all sentence, to build up a dictionary for further search
#in our application, we can embed the sentence as the document been uploaded
for i in range(len(sentences)):
    embedding.append(model.encode(sentences[i], convert_to_tensor=True))
'''    
embedding_0= model.encode(sentences[0], convert_to_tensor=True)
embedding_1 = model.encode(sentences[1], convert_to_tensor=True)
embedding_2 = model.encode(sentences[2], convert_to_tensor=True)
embedding_3 = model.encode(sentences[3], convert_to_tensor=True)
'''
score = []
#compare the wanted query with all the other embedding in the dictionary
for i in range(len(embedding)-1):
    score.append(util.pytorch_cos_sim(embedding[0], embedding[i+1]))
'''
score_1 = util.pytorch_cos_sim(embedding_0, embedding_1)
score_2 = util.pytorch_cos_sim(embedding_0, embedding_2)
score_3 = util.pytorch_cos_sim(embedding_0, embedding_3)
'''

print('python in running!')
print(score)
print(embedding[0].shape)
sys.stdout.flush() # remeber to call this. or nothing will be passed to JS
    