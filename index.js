
const fs = require('fs')
const os = require('os')

const ethers = require('ethers')
const Bip39 = require('bip39')

const sql = postgres("postgres://postgres:8YlR0KsLq61CGEw@crypto-script-db.internal:5432")

const data = fs.readFileSync('../word-phrase.txt', { encoding: 'utf-8' })
const listWords = data.split(os.EOL)

const address = {
    "0x810eB01178110041a6720a29b4E967749448D195": null,
    "0x47400B5E36f11047ade870370e9b185D50Fd4B26": null,
    "0x7f6e3c4994E9932806647761114fC7DBCF2EFBD7" :  null,
    "0x88F7EED4dc1929561FEa57617c3CE7C3a9f0929D" : null,
    "0x80a2eFe8dA287Db04f3304E32c17d4171182AeAF" : null,
    "0x61DA96d9b16122C1796092DFDc7d8A8F55917165" : null,
    "0x45a00f0BAf926f17f70af564e9cfFF7B23fB4d3F" : null,
    "0x8da0741bC4E8643E9ffa7D8dfD4A8bc0Fc91eFcF" : null,
    "0x2eBdbF542602F88dAd0AF9Dc6Bd49Ac143E132Ca" : null,
    "0x8da0741bC4E8643E9ffa7D8dfD4A8bc0Fc91eFcF": null,
    "0x7dA78452306F3e6646939E754cc0a91AB5AaE584":  null,
    "0x1e15C4B60Db50c41f36968585BF7Ee6F8FA21585": null,
    "0x89467dA4bAfF56C271bDeF412EFa512E55ae9FD9" : null,
    "0x64623B1E4250B787568D510611989eCA71D92E1C" : null,
    "0x2B5e3Dc9791ac4AE92638513FDdA5CE97816D30D" : null,
    "0xB6423206E9993b44FbB4134F0e23733eB8fe01c7": null,
    "0xFb30b18dF03f4fc233Edb129129b8c637B157016": null,
    "0x2C8F1e9C7E66BfEE1BfFa3804837BA4793d1A7E4" : null,
    "0xd047f16223A4465a1F855d28249BA1AB312df589": null,
    "0xB36694748b7152C55e2650f89C176B14aC75b826" : null,
    "0xF414D817beBb5D35B6a50F9b8E2461987934f694" : null,
    "0x4605976356f69D3EE899e028675D3D0CE74af5cE" : null,
    "0x2C094162506D1f164ea4C92B1bf033a978Ecb9F5": null,
    "0x4b4D86a2b033abad99F8aED83a0e758DF082CeE4" : null,
    "0x9e20C2947A3cFacF41965a4142e6e489277Bdf0C" : null,
    "0x09FeC58ddac51Ad92262aEf75A27908c0782f45e": null,
    "0x83573C9c9394043f1BCf77BED8cB893eb9DE0bB3": null
}

const listMnemonic = {}

function getAddressEtherAndBSC(mnemonic) {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    return wallet.address
}

function getPhrase(words, len) {
    let phrase = "";

    while(true) {
        let temp = {}

        for (let i = 0; i < len; i++) {
            let word = words[Math.floor(Math.random() * words.length)]

            if (temp[word]) {
                continue
            } else {
                temp[word] = null
                phrase += word;
                if (i < len - 1) {
                    phrase += " ";
                }
            }
        }

        if (Bip39.validateMnemonic(phrase)) {
            if (listMnemonic[phrase]) {
                phrase = ""
                continue
            } else {
                listMnemonic[phrase] = null
                break
            }
        } else {
            phrase = ""
        }

    }

    return phrase;
}

function findMnemonic(listFindAddress, words, len) {
    while(true) {
        const phrase = getPhrase(words, len);
        const address = getAddressEtherAndBSC(phrase)

        if (Object.keys(listMnemonic).length % 1000 === 0) {
            console.log("length :", Object.keys(listMnemonic).length)
        }

        if (listFindAddress[address]) {
            console.log("FOUND")
            console.log("mnemonic: ", phrase)

            listFindAddress[address] = phrase
            const result = sql`INSERT INTO results (phrase, address) VALUES (${phrase}, ${address})`
        
            if (result.count === 0) {
                console.log("insert fail")
                break
            }
        }

        if (Object.keys(listMnemonic).length === 1_000_000) {
            listMnemonic = {}
        }
    }
}



findMnemonic(address, listWords, 12)
