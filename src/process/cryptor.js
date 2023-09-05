const fs = require('fs');
const crypto = require('crypto');

// Kullanılacak şifre

// Şifreleme algoritması seçimi
const algorithm = 'aes-256-cbc';

// Dosyayı şifrele
const encrypt = (password, inputFile, result, id) => {
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.scryptSync(password, 'salt', 16);


  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const input = fs.createReadStream(inputFile);
  const output = fs.createWriteStream(result);


  const { loadData, saveData } = require('./jsonDataReaderWriter');
  var dataJSON = loadData();


  const hash = crypto.createHash('sha256'); // Kullanmak istediğiniz hash algoritmasını seçin (örneğin: 'sha256')
  input.on('data', (chunk) => {
    hash.update(chunk); // Dosyanın her bölümünü güncelleyin
  });

  input.on('end', () => {
    const fileHash = hash.digest('hex'); // Hash'i tamamladığınızda hex formatında alın
    dataJSON[id].hash = fileHash;
    console.log(`Dosya Hash: ${fileHash}`);
  });

  input.on('error', (error) => {
    console.error('Hash alma sırasında bir hata oluştu:', error);
  });

  input.pipe(cipher).pipe(output);

  output.on('finish', () => {
    console.log('Dosya başarıyla şifrelendi.');
    fs.unlink(inputFile, (err) => {
      if (err) {
        console.error('Orijinal dosya silinemedi:', err);
      } else {
        console.log('Orijinal dosya başarıyla silindi.');
      }
    });

    dataJSON[id].encrypted = true;
    saveData(dataJSON);
  });
};

// Dosyayı çöz
const decrypt = (password, inputFile, result, id) => {
  try {
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.scryptSync(password, 'salt', 16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const input = fs.createReadStream(inputFile);
    const output = fs.createWriteStream(result);

    input.pipe(decipher).pipe(output);

    const { loadData, saveData } = require('./jsonDataReaderWriter');
    var dataJSON = loadData();

    decipher.on('error', () =>{
      console.log('error');
    })

    input.on('error', () => {
      console.log('şifre çözmede hata!');
    });

    output.on('finish', () => {

      const hash = crypto.createHash('sha256'); // Kullanmak istediğiniz hash algoritmasını seçin (örneğin: 'sha256')
      const created = fs.createReadStream(result);
      created.on('data', (chunk) => {
        hash.update(chunk); // Dosyanın her bölümünü güncelleyin
      });

      created.on('end', () => {
        const fileHash = hash.digest('hex'); // Hash'i tamamladığınızda hex formatında alın
        if (fileHash === dataJSON[id].hash) {
          console.log('Dosya başarıyla çözüldü.');
          fs.unlink(inputFile, (err) => {
            if (err) {
              console.error('Şifrelenen dosya silinemedi:', err);
            } else {
              console.log('Şifrelenen dosya silindi');
            }
          });

          dataJSON[id].encrypted = false;
          saveData(dataJSON);
        }
        else {
          console.log('Şifre Yanlış');
          fs.unlink(created, (err) => {
            if (err) {
              console.error('Yanlış şifrelenmiş dosya silinemedi:', err);
            } else {
              console.log('Yanlış şifre girilen dosya temizlendi.');
            }
          });
        }
        console.log(`Dosya Hash: ${fileHash}`);
      });

      created.on('error', (error) => {
        console.error('Hash alma sırasında bir hata oluştu:', error);
      });





    });
  } catch (error) {
    console.log('yanlış şifre girildi!');
  }
};

module.exports = { encrypt, decrypt };