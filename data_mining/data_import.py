from urllib2 import urlopen
from contextlib import closing
import os

from numpy import genfromtxt
from pylab import plot, figure, subplot, hist, xlim, show

import matplotlib
matplotlib.rcParams['backend'] = "Qt4Agg"


def download_csv():
    if not os.path.isfile('iris.csv'):
        url = 'http://aima.cs.berkeley.edu/data/iris.csv'
        with closing(urlopen(url)) as u, open('iris.csv', 'w') as f:
            f.write(u.read())
    else:
        print 'File exists'


def parse_csv():
    # read the first 4 columns
    data = genfromtxt('iris.csv', delimiter=',', usecols=(0, 1, 2, 3))
    # read the fifth column
    target = genfromtxt('iris.csv', delimiter=',', usecols=4, dtype=str)

    print data.shape
    print target.shape
    print data[target == 'setosa', 0]

    plot(data[target == 'setosa', 0], data[target == 'setosa', 2], 'bo')
    plot(data[target == 'versicolor', 0], data[target == 'versicolor', 2], 'ro')
    plot(data[target == 'virginica', 0], data[target == 'virginica', 2], 'go')
    show()

    # xmin = min(data[:, 0])
    # xmax = max(data[:, 0])
    # figure()
    # subplot(411) # distribution of the setosa class (1st, on the top)
    # hist(data[target == 'setosa', 0], color='b', alpha=.7)
    # xlim(xmin, xmax)
    # subplot(412) # distribution of the versicolor class (2nd)
    # hist(data[target == 'versicolor', 0], color='r', alpha=.7)
    # xlim(xmin, xmax)
    # subplot(413) # distribution of the virginica class (3rd)
    # hist(data[target == 'virginica', 0], color='g', alpha=.7)
    # xlim(xmin, xmax)
    # subplot(414) # global histogram (4th, on the bottom)
    # hist(data[:, 0], color='y', alpha=.7)
    # xlim(xmin, xmax)
    # show()


if __name__ == '__main__':
    download_csv()
    parse_csv()