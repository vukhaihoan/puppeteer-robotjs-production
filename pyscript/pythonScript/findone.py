import cv2
import sys
import os
import pathlib
method = cv2.TM_SQDIFF_NORMED

# Read the images from the file
small_image = cv2.imread(sys.argv[1]) # './img/sao.png'
large_image = cv2.imread(sys.argv[2]) # './img/screenShoot62001.png'

result = cv2.matchTemplate(small_image, large_image, method)
# We want the minimum squared difference
mn,_,mnLoc,_ = cv2.minMaxLoc(result)

# Draw the rectangle:
# Extract the coordinates of our best match
MPx,MPy = mnLoc
# Step 2: Get the size of the template. This is the same size as the match.
trows,tcols = small_image.shape[:2]
# print(MPx,MPy)
# print(tcols,trows)
print(MPx + tcols/2,MPy + trows /2) ###################################################################################

# Step : crop image
currentPath = pathlib.Path(__file__).parent.resolve() 
sharedImgPath = str(currentPath.parent.parent) + "\\shared\\images"
resultPath = sharedImgPath + "\\results\\" + sys.argv[1].split('\\')[-1].split('.')[0] + ".png"
cropPath = sharedImgPath + "\\crops\\" + sys.argv[1].split('\\')[-1].split('.')[0] + ".png"
y=MPy
x=MPx
h=trows
w=tcols
crop_img = large_image[y:y+h, x:x+w]
cv2.imwrite(cropPath, crop_img)
# Step 3: Draw the rectangle on large_image
finnalimg = cv2.rectangle(large_image, (MPx,MPy),(MPx+tcols,MPy+trows),(0,0,255),2)

cv2.imwrite(resultPath, finnalimg)

# Display the original image with the rectangle around the match.
# cv2.imshow('img', finnalimg)

# The image is only displayed if we call this

cv2.waitKey(0)