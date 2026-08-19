const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/2iZ7GCw",
  "https://meli.la/2rH2axX",
  "https://meli.la/1eux19R",
  "https://meli.la/2suscK2",
  "https://meli.la/1hmHGMS",
  "https://meli.la/23hayrR",
  "https://meli.la/2Bxxrck",
  "https://meli.la/29E4eSM",
  "https://meli.la/2Sdjofc",
  "https://meli.la/2TW6mcA",
  "https://meli.la/2zKbYe2",
  "https://meli.la/1mjHKDt",
  "https://meli.la/17gpiuC",
  "https://meli.la/2HvvQeX",
  "https://meli.la/2Ke4x1a",
  "https://meli.la/1qK1Qkt",
  "https://meli.la/2gD4Qnr",
  "https://meli.la/31krx7F",
  "https://meli.la/2s6XrMw",
  "https://meli.la/1FH7XC4",
  "https://meli.la/2Y5m2Zk",
  "https://meli.la/1Fp8Ym4",
  "https://meli.la/24gCrfX",
  "https://meli.la/17RB18c",
  "https://meli.la/1Gx3Wtr",
  "https://meli.la/1t6wJut",
  "https://meli.la/2YxARXj",
  "https://meli.la/2u5BFco",
  "https://meli.la/1Ld7C7r",
  "https://meli.la/1MisDeJ",
  "https://meli.la/1iXfpV8",
  "https://meli.la/2gFr5XH",
  "https://meli.la/2r18RDg",
  "https://meli.la/1SauuAf",
  "https://meli.la/1WWXSm8",
  "https://meli.la/2ZYFdi8",
  "https://meli.la/293VZVg",
  "https://meli.la/14d4HHU",
  "https://meli.la/2jrPZko",
  "https://meli.la/2qQSmrY",
  "https://meli.la/2wFUs8s",
  "https://meli.la/2ZDeeTR",
  "https://meli.la/2N2df3Y",
  "https://meli.la/2JWKPRE",
  "https://meli.la/2Cvaxii",
  "https://meli.la/1PFuwLQ",
  "https://meli.la/1R2Z1Xm",
  "https://meli.la/2sx9sCz",
  "https://meli.la/2kXjwhH",
  "https://meli.la/1k94wAC",
  "https://meli.la/1vxDKR4",
  "https://meli.la/23nHTVo",
  "https://meli.la/2rcRAkj",
  "https://meli.la/1aPvUyE",
  "https://meli.la/29M2HCy",
  "https://meli.la/1d5AqFu",
  "https://meli.la/25v5RbW",
  "https://meli.la/2DFsJHX",
  "https://meli.la/2z8Nvfq",
  "https://meli.la/2vtojXM",
  "https://meli.la/2tefCYt",
  "https://meli.la/1b8GSi9",
  "https://meli.la/12JG7Gz",
  "https://meli.la/1cLPr4x",
  "https://meli.la/2ojXptb",
  "https://meli.la/1A8Be9M",
  "https://meli.la/2ySqyFA",
  "https://meli.la/1AFVNLz",
  "https://meli.la/191K8WJ",
  "https://meli.la/2cRxEdj",
  "https://meli.la/1kMjEuy",
  "https://meli.la/1oVAhZM",
  "https://meli.la/2p9gdaM",
  "https://meli.la/2k3ZRUV",
  "https://meli.la/2ZwKMRR",
  "https://meli.la/2X5TDUk",
  "https://meli.la/15GDyVe",
  "https://meli.la/2mia9vZ",
  "https://meli.la/1UhxQv3",
  "https://meli.la/2HtnLb5",
  "https://meli.la/2cr2Dpe",
  "https://meli.la/1RqdeWy",
  "https://meli.la/2JR2rxc",
  "https://meli.la/1hqYmYR",
  "https://meli.la/183Jfhk",
  "https://meli.la/1uVxFvi",
  "https://meli.la/25E7dCT",
  "https://meli.la/23nuTMM",
  "https://meli.la/2DKgs93",
  "https://meli.la/1GaYfrB",
  "https://meli.la/1rPDD2e",
  "https://meli.la/1UGZJYH",
  "https://meli.la/2zvkZJu",
  "https://meli.la/1JL2zYP",
  "https://meli.la/1BPMeuh",
  "https://meli.la/15REDcA",
  "https://meli.la/1sS5yXL",
  "https://meli.la/2QU8Z9L",
  "https://meli.la/1ZQ1qZg",
  "https://meli.la/13GAvHm",
  "https://meli.la/1JjtK9J",
  "https://meli.la/2qHwx8T",
  "https://meli.la/1Lnfj4W",
  "https://meli.la/1yEpYUP",
  "https://meli.la/1kNesp1",
  "https://meli.la/2xJfZMT",
  "https://meli.la/2uuzGKB",
  "https://meli.la/1YiAZYq",
  "https://meli.la/34necuV",
  "https://meli.la/2nbGq9y",
  "https://meli.la/2vUzJZp",
  "https://meli.la/27c2eHs",
  "https://meli.la/1idWz5u",
  "https://meli.la/23NUVfT",
  "https://meli.la/33uA8t5",
  "https://meli.la/2bcfxpp",
  "https://meli.la/1ihGiDT",
  "https://meli.la/2vnmPKR",
  "https://meli.la/1Q3dU8B",
  "https://meli.la/2Lp8HLT",
  "https://meli.la/1RarPbj",
  "https://meli.la/1x1jqDt",
  "https://meli.la/1XViNZB",
  "https://meli.la/2vXV4uz",
  "https://meli.la/2q4qifn",
  "https://meli.la/2Xo5T8T",
  "https://meli.la/2HJ8VrS",
  "https://meli.la/1H8kTXo",
  "https://meli.la/2oaDXPd",
  "https://meli.la/1iGpBy3",
  "https://meli.la/2JTU739",
  "https://meli.la/2ZAcBS1",
  "https://meli.la/29qgDfE",
  "https://meli.la/31nWF5s",
  "https://meli.la/1xbTbRq",
  "https://meli.la/2Bm6Suk",
  "https://meli.la/2rCRMfT",
  "https://meli.la/2Eg9q4v",
  "https://meli.la/1WLi8DW",
  "https://meli.la/2ymbqPo",
  "https://meli.la/2mepx2Z",
  "https://meli.la/1GJPLCm",
  "https://meli.la/1o8fcgv",
  "https://meli.la/2EMbiHz",
  "https://meli.la/2VAk6z3",
  "https://meli.la/24hsCM9",
  "https://meli.la/2328LgN",
  "https://meli.la/2jsefUP",
  "https://meli.la/1f5TDht",
  "https://meli.la/2172Tga",
  "https://meli.la/1q8xSB8",
  "https://meli.la/25LxHGS",
  "https://meli.la/2UgMiL1",
  "https://meli.la/2ft1J3b",
  "https://meli.la/1vvunKG",
  "https://meli.la/2tDfL6t",
  "https://meli.la/2MMuWse",
  "https://meli.la/27gdDmZ",
  "https://meli.la/1i6kKR6",
  "https://meli.la/2vs2Mb8",
  "https://meli.la/2S7dweH",
  "https://meli.la/2BDzZgR",
  "https://meli.la/24mMPYg",
  "https://meli.la/192h9RM",
  "https://meli.la/1V83cH8",
  "https://meli.la/2wzJS95",
  "https://meli.la/1DQHiwA",
  "https://meli.la/1cJdQcf",
  "https://meli.la/1jedhBf",
  "https://meli.la/2fzmteF",
  "https://meli.la/1ysjon4",
  "https://meli.la/1n8mKCm",
  "https://meli.la/2isWDKV",
  "https://meli.la/1jUve4Q",
  "https://meli.la/142wB2T",
  "https://meli.la/2TgQmWH",
  "https://meli.la/2mNs7uW",
  "https://meli.la/14xAo5V",
  "https://meli.la/1xgerTg",
  "https://meli.la/2NicZHA",
  "https://meli.la/2NcNW1d",
  "https://meli.la/1nrdnAa",
  "https://meli.la/2cvcB4Q",
  "https://meli.la/14Tx5ZP",
  "https://meli.la/1tAWKTy",
  "https://meli.la/31VCS4W",
  "https://meli.la/2pBRRYk",
  "https://meli.la/1tQ3AWW",
  "https://meli.la/1GnWQfM",
  "https://meli.la/1ELQEU5",
  "https://meli.la/1QV8ki4",
  "https://meli.la/1Luijoq",
  "https://meli.la/2EoLduc",
  "https://meli.la/1D9YQcQ",
  "https://meli.la/2Y52hwH",
  "https://meli.la/2iPwyWz",
  "https://meli.la/2HBvDPy",
  "https://meli.la/15RLRUC",
  "https://meli.la/14XMdFK",
  "https://meli.la/1vi5heu",
  "https://meli.la/1Fb8hW5",
  "https://meli.la/13hRwJE",
  "https://meli.la/2MYwGC6",
  "https://meli.la/1ynyekW",
  "https://meli.la/2bWrYGE",
  "https://meli.la/1rCQ4p7",
  "https://meli.la/2J58psE",
  "https://meli.la/2rgo86k",
  "https://meli.la/1bvBKFZ",
  "https://meli.la/1afNfax",
  "https://meli.la/24PFRXQ",
  "https://meli.la/12VmEQy",
  "https://meli.la/2NGiPza",
  "https://meli.la/1P2oiWE",
  "https://meli.la/2RdzuvX",
  "https://meli.la/1778Fax",
  "https://meli.la/1sG7qmC",
  "https://meli.la/2uY4GNi",
  "https://meli.la/1hvRrtQ",
  "https://meli.la/2piPSyc",
  "https://meli.la/2Lc1wDv",
  "https://meli.la/1U17x6t",
  "https://meli.la/1MHXitP",
  "https://meli.la/2p428Hi",
  "https://meli.la/2mwCJdL",
  "https://meli.la/1XrBF35",
  "https://meli.la/1AvMxf1",
  "https://meli.la/2gZZ1TD",
  "https://meli.la/1AC6wtv",
  "https://meli.la/1wRZHAt",
  "https://meli.la/2wN4THB",
  "https://meli.la/2x3U7eJ",
  "https://meli.la/1E7LuB8",
  "https://meli.la/15CU3uc",
  "https://meli.la/1bygUuc",
  "https://meli.la/1ArSkUB",
  "https://meli.la/1hdP8zY",
  "https://meli.la/2nXC9L7",
  "https://meli.la/14b4cic",
  "https://meli.la/2KCqV2A",
  "https://meli.la/2eATgxS",
  "https://meli.la/1Y5XsRS",
  "https://meli.la/2EVQyob",
  "https://meli.la/25XBuuo",
  "https://meli.la/23TvuuQ",
  "https://meli.la/1CJbrab",
  "https://meli.la/23XEBP6",
  "https://meli.la/32yrRQU",
  "https://meli.la/34ifz1Q",
  "https://meli.la/2TKPMjJ",
  "https://meli.la/2Wik6ns",
  "https://meli.la/1RWU14h",
  "https://meli.la/1J5wu6R",
  "https://meli.la/1PQrtSD",
  "https://meli.la/19FEce3",
  "https://meli.la/25FZHLC",
  "https://meli.la/2rqkuoH",
  "https://meli.la/1BVqMBy",
  "https://meli.la/2M7sKNF",
  "https://meli.la/1t4bC6M",
  "https://meli.la/1TyKkR3",
  "https://meli.la/1LwRm6i",
  "https://meli.la/1eH3jVw",
  "https://meli.la/1p7DPD2",
  "https://meli.la/2DVfUrV",
  "https://meli.la/12WveJn",
  "https://meli.la/2MRAvGc",
  "https://meli.la/2oXpyQd",
  "https://meli.la/2VDYeJF",
  "https://meli.la/1jDyoEp",
  "https://meli.la/2FDjban",
  "https://meli.la/2vpVLGy",
  "https://meli.la/1dJenT7",
  "https://meli.la/1oDUWwU",
  "https://meli.la/2c776b9",
  "https://meli.la/23xkW91",
  "https://meli.la/1A7s2NQ",
  "https://meli.la/21Bm4Zn",
  "https://meli.la/1tqBV2i",
  "https://meli.la/2JceThZ",
  "https://meli.la/1XXjPtS"
];
function exportarLinksParaConversao(arquivoOrigem, arquivoDestino, arquivoTxt) {
    try {
        const dadosBrutos = fs.readFileSync(arquivoOrigem, 'utf-8')
        const listaProdutos = JSON.parse(dadosBrutos)

        let conteudoTxt = ''
        const tamanhoBloco = 30

        const listaFiltrada = listaProdutos.map((produto, index) => {
            let linkOriginal = produto.link.trim()

            // Organiza os blocos visuais de 30 em 30 no TXT
            if (index % tamanhoBloco === 0) {
                const numeroBloco = Math.floor(index / tamanhoBloco) + 1
                conteudoTxt += `\n=== BLOCO ${numeroBloco} ===\n`
            }
            conteudoTxt += `${linkOriginal}\n`

            // RETORNA O OBJETO COMPLETO: Mantém o id, o link e agora o título para a validação!
            return { 
                id: produto.id, 
                titulo: produto.titulo, // Crucial para o Passo 2 não quebrar
                link: linkOriginal 
            }
        })

        // Salva o JSON temporário com a estrutura id, titulo e link
        fs.writeFileSync(arquivoDestino, JSON.stringify(listaFiltrada, null, 2), 'utf-8')
        fs.writeFileSync(arquivoTxt, conteudoTxt.trim(), 'utf-8')

        console.log(`📦 Arquivos gerados com sucesso! O "para_converter.json" agora contém os títulos para validação.`)
    } catch (erro) {
        console.error('❌ Erro ao exportar:', erro.message)
    }
}

function limparTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, "")       // Remove tudo que não for letra ou número
}

async function atualizarListaTemporaria(arquivoTemporario, listaLinks) {

try {

const dadosBrutos = fs.readFileSync(arquivoTemporario, 'utf-8')

const listaTemp = JSON.parse(dadosBrutos)



console.log(`⏳ Analisando ${listaLinks.length} links via conferência de título...`)

let atualizados = 0



for (const linkEncurtado of listaLinks) {

if (!linkEncurtado.startsWith('http')) continue



try {

const resposta = await fetch(linkEncurtado, {

headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }

})



const html = await resposta.text()

const dom = new JSDOM(html)

const documento = dom.window.document



// Busca cirúrgica usando a classe exata do título do Mercado Livre (.ui-pdp-title)

const elementoTitulo = documento.querySelector('.ui-pdp-title, h1.ui-pdp-title, .poly-component__title')


if (elementoTitulo) {

const tituloPagina = elementoTitulo.textContent.trim()

const tituloPaginaLimpo = limparTexto(tituloPagina)



// Procura no seu JSON o produto que tem o título correspondente

const produto = listaTemp.find(p => {

if (!p.titulo) return false

const tituloJsonLimpo = limparTexto(p.titulo)


return tituloJsonLimpo.includes(tituloPaginaLimpo) ||

tituloPaginaLimpo.includes(tituloJsonLimpo)

})



if (produto) {

produto.link = linkEncurtado

atualizados++

console.log(`✅ Produto localizado: "${produto.titulo}" -> Link salvo!`)

} else {

console.log(`⚠️ Título encontrado ["${tituloPagina}"], mas não bateu com nenhum item do JSON.`);

}

} else {

console.log(`❌ Não foi possível encontrar a tag .ui-pdp-title na página para o link: ${linkEncurtado}`)

}



} catch (erroLink) {

console.error(`❌ Erro ao processar o link ${linkEncurtado}:`, erroLink.message)

}

}



fs.writeFileSync(arquivoTemporario, JSON.stringify(listaTemp, null, 2), 'utf-8')

console.log(`\n📦 Processo concluído! ${atualizados} de ${listaLinks.length} produtos atualizados.`);



} catch (erro) {

console.error('❌ Erro geral:', erro.message)

}

}








function aplicarLinksConvertidos(arquivoPrincipal, arquivoEditado) {

    try {
        const dadosPrincipal = JSON.parse(fs.readFileSync(arquivoPrincipal, 'utf-8'))
        const dadosEditados = JSON.parse(fs.readFileSync(arquivoEditado, 'utf-8')) // O arquivo que você alterou na mão

        const listaAtualizada = dadosPrincipal.map(produto => {

            // Procura o ID correspondente 

            const itemEditado = dadosEditados.find(item => item.id === produto.id)
            
            if (itemEditado) {
                return {
                    ...produto,

                    link: itemEditado.link // Injeta o link de afiliado
                }
            }
            return produto
        });

        fs.writeFileSync(arquivoPrincipal, JSON.stringify(listaAtualizada, null, 2), 'utf-8')
        console.log(`✅ O arquivo principal "${arquivoPrincipal}" foi atualizado com sucesso!`)
    } catch (erro) {
        console.error('Erro ao aplicar os links:', erro.message)
    }
}



// exportarLinksParaConversao('ofertas_mercadolivre.json', 'para_converter.json', 'links_para_gerar.txt')

// atualizarListaTemporaria('para_converter.json',arrayNovosLinks)


aplicarLinksConvertidos('ofertas_mercadolivre.json', 'para_converter.json');