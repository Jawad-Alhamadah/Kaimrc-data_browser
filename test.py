import pandas as pd

df = pd.read_csv('genome_data_files\merge_vcf_sample-Tue-Oct-25-2022_(_H10-M42-S16_)_1666726936011.txt', low_memory=False,sep=['\t',' '])

df
selectedCols = "POS|ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|HGVSc|HGVSp|Consequence|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22"

selectedCols =  selectedCols.split('|')
print(selectedCols)

new_df = df[selectedCols]
print(new_df.head(10))