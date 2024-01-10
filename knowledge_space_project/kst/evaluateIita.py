import sys
import pandas as pd
from learning_spaces.kst.iita import iita
from random import randrange

if __name__ == '__main__':
    inputParams = sys.argv[1]

    column = (inputParams.split('.')[0]).split(',')
    columns = []

    for question in column:
        columns.append([])

    values = []
    for line in inputParams.split('.')[1:]:
        values = line.split(',')
        for i, val in enumerate(values):
            columns[i].append(int(val))

    required_format = {}
    for i, col in enumerate(column):
        required_format[str(col)] = columns[i]

    data_frame = pd.DataFrame(required_format)
    response = iita(data_frame, v=1)

    for pair in response['implications']:
        print(str(column[pair[0]]) + "." + str(column[pair[1]]))

