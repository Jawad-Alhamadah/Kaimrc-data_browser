import pandas as pd
import time

start = time.time()
print("Timer Started: ")




selectedCols = "POS|ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|HGVSc|HGVSp|Consequence|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22"



myfile = open("./genome_data_files/combined_annotated_VCF_allele_counts-Tue-Nov-15-2022_(_10H-58M-57S_)_1668542337171.txt", "r")
myline = myfile.readline()
while myline:
    myline = myfile.readline()
    print(myline)
myfile.close()   

end = time.time()
print(end - start)


#new_df = df[selectedCols]
#print(new_df.head(10))