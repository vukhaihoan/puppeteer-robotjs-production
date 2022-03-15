import imp
from inspect import currentframe
from itertools import count
from random import triangular
import cv2
import numpy as np
import sys
import pathlib
template = cv2.imread(sys.argv[1])  # './img/sao.png'
img_rgb = cv2.imread(sys.argv[2]) # './img/screenShoot62001.png'

w, h = template.shape[:-1]
res = cv2.matchTemplate(img_rgb, template, cv2.TM_CCOEFF_NORMED)
threshold = .8
loc = np.where(res >= threshold)
def hieu(current, pre):
    if current > pre :
        return current - pre
    elif current < pre :
        return pre - current
    else :
        return 0

def check(x, y, prex, prey):
    if (hieu(x, prex) == 0 or hieu(x, prex) == 1 or hieu(x, prex) == 2):
        if (hieu(y, prey) == 0 or hieu(y, prey) == 1 or hieu(y, prey) == 2) :
            return False
         
    if (hieu(y, prey) == 0 or hieu(y, prey) == 1 or hieu(y, prey) == 2):
        if (hieu(x, prex) == 0 or hieu(x, prex) == 1 or hieu(x, prex) == 2) :
            return False
    return True
prex = int
prey = int
i = 0
x = 0
y = 0 
firstloop = True
count = 0
for pt in zip(*loc[::-1]):  # Switch collumns and rows
    x+=pt[0]    
    y+=pt[1]
    i += 1
    # print(i, pt[0], pt[1])
    if (firstloop == False) :
        if check(pt[0], pt[1], prex, prey) :
            print ((x - pt[0]) / (i - 1) + h / 2, (y - pt[1]) / (i - 1) + w / 2)
            i = 0
            x = 0
            y = 0
    prex = pt[0]
    prey = pt[1]
    firstloop = False
    # check last loop
    count += 1
    if (count == loc[0].size) :
        print ((x - pt[0]) / (i - 1) + h / 2, (y - pt[1]) / (i - 1) + w / 2)


    cv2.rectangle(img_rgb, pt, (pt[0] + w, pt[1] + h), (0, 0, 255), 2)
currentPath = pathlib.Path(__file__).parent.resolve() 
sharedpath = str(currentPath.parent.parent) + "\\shared\\images\\results\\"
path = sharedpath + sys.argv[1].split('\\')[-1].split('.')[0] + ".png"
cv2.imwrite(path, img_rgb)
# cv2.imshow('img', img_rgb)
cv2.waitKey(0)

# chuwa crop img 