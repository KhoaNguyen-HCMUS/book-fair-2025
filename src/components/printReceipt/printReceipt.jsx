import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize the virtual file system
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Define default fonts
const defaultFonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

// Set fonts
pdfMake.fonts = defaultFonts;

const formatReceiptNumber = (receiptId) => {
  const number = receiptId.split('_')[1];
  return number.padStart(6, '0');
};

const formatDateTime = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(
    2,
    '0'
  )}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
  return { formattedDate, formattedTime };
};

const generateTableRows = (items) => {
  return items.map((item, index) => [
    { text: `${index + 1}`, alignment: 'center' },
    { text: item.id_product, alignment: 'center' },
    item.name,
    { text: item.quantity, alignment: 'center' },
    { text: `${parseFloat(item.price).toLocaleString('vi-VN')}`, alignment: 'right' },
    { text: `${(item.quantity * parseFloat(item.price)).toLocaleString('vi-VN')}`, alignment: 'right' },
  ]);
};

const calculateTotalQuantity = (items) => {
  return items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
};

export const generateInvoicePDF = async (receiptData, items) => {
  console.log('Receipt Data:', receiptData);
  console.log('Items:', items);
  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  };

  const logoBase64 = await getBase64FromUrl('/logo.png');
  const { formattedDate, formattedTime } = formatDateTime();
  const totalQuantity = calculateTotalQuantity(items);
  const itemRows = generateTableRows(items);

  const docDefinition = {
    pageSize: { width: 300, height: 'auto' },
    pageMargins: [10, 10, 10, 10],
    content: [
      // Logo
      logoBase64
        ? {
            image: logoBase64,
            width: 50,
            alignment: 'center',
            margin: [0, 0, 0, 10],
          }
        : null,
      // Tiêu đề
      { text: 'Hội sách Mơ Hỏi Mở 2025', style: 'header', alignment: 'center' },
      // Tiêu đề hóa đơn
      { text: 'HÓA ĐƠN BÁN HÀNG', style: 'invoiceHeader', alignment: 'center', margin: [0, 10] },

      // Thông tin chung
      {
        columns: [
          { text: `Ngày: ${formattedDate}`, width: '*', alignment: 'left' },
          { text: `Số phiếu: ${formatReceiptNumber(receiptData.id_receipt)}`, width: '*', alignment: 'right' },
        ],
        margin: [0, 5],
      },
      {
        columns: [
          { text: `Thu ngân: ${receiptData.name_cashier}`, width: '*', alignment: 'left' },
          { text: `In lúc: ${formattedTime}`, width: '*', alignment: 'right' },
        ],
        margin: [0, 2],
      },

      // Bảng sản phẩm
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'STT', style: 'tableHeader', alignment: 'center' },
              { text: 'Mã sách', style: 'tableHeader', alignment: 'center' },
              { text: 'Mặt hàng', style: 'tableHeader' },
              { text: 'SL', style: 'tableHeader', alignment: 'center' },
              { text: 'Đơn giá', style: 'tableHeader', alignment: 'right' },
              { text: 'T Tiền', style: 'tableHeader', alignment: 'right' },
            ],
            ...itemRows,
            [
              { text: 'Tổng SL:', style: 'tableFooter', colSpan: 3, alignment: 'right' },
              {},
              {},
              { text: totalQuantity, style: 'tableFooter', alignment: 'center' },
              { text: '', style: 'tableFooter' },
              { text: '', style: 'tableFooter' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      // Tổng tiền
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'Tổng tiền: ', style: 'totalLabel' },
                  {
                    text: `${Math.floor(receiptData.total_amount).toLocaleString('vi-VN')}`,

                    style: 'totalAmount',
                  },
                ],
                alignment: 'right',
                bold: true,
                fontSize: 13,
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 5],
      },

      // Giảm giá
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'Giảm giá: ', style: 'voucher' },
                  {
                    text: `${Math.floor(receiptData.voucher).toLocaleString('vi-VN')}`,
                    style: 'voucher',
                  },
                ],
                alignment: 'right',
                bold: true,
                fontSize: 13,
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 5],
      },

      // Thành tiền
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'Thành tiền: ', style: 'totalLabel' },
                  {
                    text: `${Math.floor(receiptData.total_amount - (receiptData.voucher || 0)).toLocaleString(
                      'vi-VN'
                    )}`,
                    style: 'totalReceipt',
                  },
                ],
                alignment: 'right',
                bold: true,
                fontSize: 13,
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 5],
      },

      // Tiền bằng chữ
      {
        text: `(${numberToWordsVietnamese(Math.floor(receiptData.total_amount - (receiptData.voucher || 0)))})`,
        style: 'amountInWords',
        alignment: 'center',
        italics: true,
      },

      // Lời cảm ơn
      {
        text: 'Xin cảm ơn Quý khách/ Thank you!',
        alignment: 'center',
        margin: [0, 10, 0, 0],
        italics: true,
      },
    ].filter(Boolean),
    styles: {
      header: {
        fontSize: 11,
        bold: true,
        margin: [0, 0, 0, 2],
      },

      invoiceHeader: {
        fontSize: 13,
        bold: true,
        margin: [0, 5, 0, 5],
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        alignment: 'center',
      },
      tableFooter: {
        fontSize: 10,
        bold: true,
      },
      totalLabel: {
        fontSize: 11,
        bold: true,
      },
      totalAmount: {
        fontSize: 11,
        bold: true,
      },
      voucher: {
        fontSize: 11,
        bold: false,
      },
      totalReceipt: {
        fontSize: 11,
        bold: true,
      },
      amountInWords: {
        fontSize: 9,
        italics: true,
      },
    },
    defaultStyle: {
      fontSize: 10,
      font: 'Roboto',
    },
  };

  pdfMake.createPdf(docDefinition).download(`HoaDon-${receiptData.id_receipt}.pdf`);
};

// Hàm chuyển số thành chữ tiếng Việt
function numberToWordsVietnamese(number) {
  const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const teens = [
    'mười',
    'mười một',
    'mười hai',
    'mười ba',
    'mười bốn',
    'mười lăm',
    'mười sáu',
    'mười bảy',
    'mười tám',
    'mười chín',
  ];
  const tens = [
    '',
    'mười',
    'hai mươi',
    'ba mươi',
    'bốn mươi',
    'năm mươi',
    'sáu mươi',
    'bảy mươi',
    'tám mươi',
    'chín mươi',
  ];

  function readHundreds(num) {
    if (num === 0) return '';

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let result = '';

    if (hundred > 0) {
      result = units[hundred] + ' trăm';

      if (remainder > 0) {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;

        if (ten === 0) {
          result += ' lẻ ' + units[unit];
        } else if (ten === 1) {
          result += ' ' + teens[unit];
        } else {
          result += ' ' + tens[ten];
          if (unit > 0) {
            if (unit === 1) {
              result += ' mốt';
            } else if (unit === 5) {
              result += ' lăm';
            } else {
              result += ' ' + units[unit];
            }
          }
        }
      }
    } else {
      // Xử lý số dưới 100
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;

      if (ten === 0) {
        result = units[unit];
      } else if (ten === 1) {
        result = teens[unit];
      } else {
        result = tens[ten];
        if (unit > 0) {
          if (unit === 1) {
            result += ' mốt';
          } else if (unit === 5) {
            result += ' lăm';
          } else {
            result += ' ' + units[unit];
          }
        }
      }
    }

    return result;
  }

  if (number === 0) return 'không';

  const billion = Math.floor(number / 1000000000);
  const million = Math.floor((number % 1000000000) / 1000000);
  const thousand = Math.floor((number % 1000000) / 1000);
  const remainder = number % 1000;

  let result = '';

  if (billion > 0) {
    result = readHundreds(billion) + ' tỷ';
  }

  if (million > 0) {
    result += (result ? ' ' : '') + readHundreds(million) + ' triệu';
  }

  if (thousand > 0) {
    result += (result ? ' ' : '') + readHundreds(thousand) + ' nghìn';
  }

  if (remainder > 0) {
    result += (result ? ' ' : '') + readHundreds(remainder);
  }

  return result + ' đồng chẵn';
}
