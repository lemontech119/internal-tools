import pandas as pd
import openpyxl
from openpyxl.drawing.image import Image
import requests
from io import BytesIO
from PIL import Image as PILImage

file_name = '주부나라';

# CSV 파일을 읽어서 DataFrame으로 변환
df = pd.read_csv(f'csv/{file_name}.csv')

# 새로운 엑셀 파일 생성
writer = pd.ExcelWriter(f'csv/{file_name}.xlsx', engine='openpyxl')
df.to_excel(writer, index=False)

# 엑셀 파일을 위한 openpyxl 객체 얻기
workbook = writer.book
worksheet = writer.sheets['Sheet1']

# 이미지 URL이 있는 열을 반복 처리
# for index, row in df.iterrows():
#     image_url = row['thumbnail']  # 이미지 URL이 있는 열 이름
#     response = requests.get(image_url)
#     # img = Image(BytesIO(response.content))
#     img_data = BytesIO(response.content)
#     img = PILImage.open(img_data)

#     width, height = img.size

#     new_width = 100
#     new_height = int((new_width / width) * height)
#     img = img.resize((new_width, new_height), PILImage.ANTIALIAS)

#     img_byte_arr = BytesIO()
#     img.save(img_byte_arr, format='PNG')
#     img_byte_arr = img_byte_arr.getvalue()


#     # 이미지 삽입 위치 설정 (예: 'A2', 'B2' 등)
#     cell_address = f'D{index + 2}'  # 헤더가 1행이므로 index에 2를 더함

#     img_to_insert = openpyxl.drawing.image.Image(BytesIO(img_byte_arr))
#     worksheet.add_image(img_to_insert, f'B{index + 2}')
for index, row in df.iterrows():
    image_url = row['thumbnail']
    response = requests.get(image_url)
    img_data = BytesIO(response.content)
    img = PILImage.open(img_data)

    # 이미지의 원본 크기를 얻음
    width, height = img.size

    # 셀의 크기에 맞게 이미지 크기 조정 (가로 100, 세로 비율에 맞게 조정)
    new_width = 100
    new_height = int((new_width / width) * height)
    img = img.resize((new_width, new_height), PILImage.Resampling.LANCZOS)  # 수정된 부분

    # 이미지를 BytesIO 객체로 변환
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    # 이미지 삽입
    img_to_insert = openpyxl.drawing.image.Image(BytesIO(img_byte_arr))
    worksheet.add_image(img_to_insert, f'B{index + 2}')


# 파일 저장
writer.close()
