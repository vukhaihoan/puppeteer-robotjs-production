from PIL import Image
import imagehash
import sys
import cv2
hash0 = imagehash.average_hash(Image.open(sys.argv[1])) # '../images/templates/ok_popup.png'
hash1 = imagehash.average_hash(Image.open(sys.argv[2])) # '../images/crops/ok_popup.png'
# cutoff = 16  # maximum bits that could be different between the hashes. 
# img1 = cv2.imread(sys.argv[1])
# img2 = cv2.imread(sys.argv[2])
# cv2.imshow('img1', img1)
# cv2.waitKey(0)
# cv2.imshow('img2', img2)
# cv2.waitKey(0)
print(hash0 - hash1)
# if hash0 - hash1 < cutoff:
#   print('images are similar')
# else:
#   print('images are not similar')