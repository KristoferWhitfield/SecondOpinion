function startProcessing() {
  let img = document.getElementById('ocr');
  Tesseract.recognize(
    img,
    'eng', {
      logger: m => console.log(m)
    }
  ).then((res) => res).then(({
    data
  }) => {
    console.log(data.text, typeof(data.text)); // returns type as string
    console.log(Number(data.text), parseInt(data.text)); // converting string to number

    // Array with number i.e '4567' --> [4,5,6,7]
    let convertedNumber = [...data.text].map((num) => Number(num));
    // Calculating the sum of the numbers in convertedNumber Array
    let sum = convertedNumber.reduce((acc, curr) => acc + curr);
    console.log(':::SUM:::', sum);
  })
}
