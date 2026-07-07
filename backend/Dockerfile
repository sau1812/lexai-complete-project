FROM node:20-alpine

# Install tesseract OCR
RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng tesseract-ocr-data-hin

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "src/index.js"]
