import pandas as pd
from pip._vendor.pyparsing import removeQuotes
import os
from learning_spaces.kst.iita import iita

if __name__ == '__main__':
    f = open('pisa.txt','r')
    column = f.readline().split()

    columns = []

    for question in column:
        columns.append([])

    values = []
    for line in f.readlines():
        values = line.split()[1:]
        for i, val in enumerate(values):
            columns[i].append(int(val))

    required_format = {}

    for i, col in enumerate(column):
        required_format[str(col)] = columns[i]

    data_frame = pd.DataFrame(required_format)
    print (required_format)
    response = iita(data_frame, v=1)

    for pair in response['implications']:
        print(str(pair[0]) + "." + str(pair[1]))
