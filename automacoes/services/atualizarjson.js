const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/2qkHBgX",
  "https://meli.la/28CU7V4",
  "https://meli.la/2r1twnj",
  "https://meli.la/1cXXK5i",
  "https://meli.la/21ySWh6",
  "https://meli.la/1nq6zEA",
  "https://meli.la/1uCjScZ",
  "https://meli.la/2NwzDqa",
  "https://meli.la/2GfHG1R",
  "https://meli.la/2ByPUDS",
  "https://meli.la/2s3fvUd",
  "https://meli.la/2uGUGSR",
  "https://meli.la/17dvUkd",
  "https://meli.la/17tiBWA",
  "https://meli.la/2bgfZxU",
  "https://meli.la/2G8ZzWS",
  "https://meli.la/2mwCJdL",
  "https://meli.la/12exmo6",
  "https://meli.la/1Tt5zvv",
  "https://meli.la/27c4rX4",
  "https://meli.la/2bERGt3",
  "https://meli.la/2ug1p3U",
  "https://meli.la/2EiFZiS",
  "https://meli.la/19rEEHf",
  "https://meli.la/2fKszaY",
  "https://meli.la/2v3oUTU",
  "https://meli.la/2Tryzy3",
  "https://meli.la/1jedhBf",
  "https://meli.la/1gqPjxs",
  "https://meli.la/15Ve2Y9",
  "https://meli.la/2NicZHA",
  "https://meli.la/2k8yMVi",
  "https://meli.la/1VKmQ1g",
  "https://meli.la/2wjh5xy",
  "https://meli.la/331uPjY",
  "https://meli.la/1UdDtuk",
  "https://meli.la/17EjCPD",
  "https://meli.la/1Lnfj4W",
  "https://meli.la/1fhwNNM",
  "https://meli.la/1cSuQwu",
  "https://meli.la/1t9CHf2",
  "https://meli.la/2LU9iDe",
  "https://meli.la/249UtMN",
  "https://meli.la/1GnWQfM",
  "https://meli.la/2328LgN",
  "https://meli.la/2piPSyc",
  "https://meli.la/1YemMFS",
  "https://meli.la/22MxF14",
  "https://meli.la/2HddT8c",
  "https://meli.la/1XRvvdx",
  "https://meli.la/2nNsCN6",
  "https://meli.la/2cYPVVU",
  "https://meli.la/1VUjqaS",
  "https://meli.la/15MZ92K",
  "https://meli.la/24e2spz",
  "https://meli.la/2q9eHVt",
  "https://meli.la/1AzbXop",
  "https://meli.la/1L6akjZ",
  "https://meli.la/24Uwicu",
  "https://meli.la/2dBd6UF",
  "https://meli.la/33deGzv",
  "https://meli.la/1ZXZMKx",
  "https://meli.la/189jdke",
  "https://meli.la/26nQTG3",
  "https://meli.la/2si7w6d",
  "https://meli.la/1UG5KpW",
  "https://meli.la/1ZSxF9n",
  "https://meli.la/1JEVBkE",
  "https://meli.la/1a39au3",
  "https://meli.la/1EW122d",
  "https://meli.la/1zqVP7W",
  "https://meli.la/1ybMxP5",
  "https://meli.la/2F6eXzp",
  "https://meli.la/2UdMBr3",
  "https://meli.la/2jisa79",
  "https://meli.la/1aisjjJ",
  "https://meli.la/31ncJCE",
  "https://meli.la/1GYCyxp",
  "https://meli.la/2eKJTnU",
  "https://meli.la/1NB8fKg",
  "https://meli.la/29hCctP",
  "https://meli.la/2S7dweH",
  "https://meli.la/2FboJbs",
  "https://meli.la/1Y4H9GE",
  "https://meli.la/2F1oaU8",
  "https://meli.la/1wrQw7r",
  "https://meli.la/2wGjWYr",
  "https://meli.la/2wx3emv",
  "https://meli.la/2iDhNVA",
  "https://meli.la/2V6bBqc",
  "https://meli.la/19ok2P9",
  "https://meli.la/2aFT5x4",
  "https://meli.la/2p8rmVC",
  "https://meli.la/1Ubekdz",
  "https://meli.la/1mE1hkB",
  "https://meli.la/2ThDmv8",
  "https://meli.la/2ojXptb",
  "https://meli.la/2JdbCQA",
  "https://meli.la/1d6qK4r",
  "https://meli.la/1w9CrUk",
  "https://meli.la/1dLh916",
  "https://meli.la/2RdzuvX",
  "https://meli.la/32yrRQU",
  "https://meli.la/18B7FZm",
  "https://meli.la/2PmZCpw",
  "https://meli.la/1yMYr7L",
  "https://meli.la/1Y75AgX",
  "https://meli.la/1SpBhCC",
  "https://meli.la/331uXdr",
  "https://meli.la/1ycYbiJ",
  "https://meli.la/1bygUuc",
  "https://meli.la/2vFEh3a",
  "https://meli.la/1rM84tc",
  "https://meli.la/1zCE8Np",
  "https://meli.la/1NEARCP",
  "https://meli.la/2jcaXqH",
  "https://meli.la/2Xtn8TG",
  "https://meli.la/1R73fSZ",
  "https://meli.la/2EDYNYK",
  "https://meli.la/2u5BFco",
  "https://meli.la/2fQqeoL",
  "https://meli.la/16gH1ga",
  "https://meli.la/1tsaqka",
  "https://meli.la/1ARoGDz",
  "https://meli.la/1YeiYJE",
  "https://meli.la/2SUT9t5",
  "https://meli.la/1daZVeW",
  "https://meli.la/1TTQd32",
  "https://meli.la/2rH2axX",
  "https://meli.la/1Q3dU8B",
  "https://meli.la/2cvcB4Q",
  "https://meli.la/2jrPZko",
  "https://meli.la/2N2df3Y",
  "https://meli.la/2Lp8HLT",
  "https://meli.la/34ifz1Q",
  "https://meli.la/1kMjEuy",
  "https://meli.la/1vvunKG",
  "https://meli.la/1QzfFn3",
  "https://meli.la/1oVAhZM",
  "https://meli.la/2M9BYrx",
  "https://meli.la/2Gx41u2",
  "https://meli.la/1gUAbkM",
  "https://meli.la/1J5wu6R",
  "https://meli.la/2Y52hwH",
  "https://meli.la/2uuzGKB",
  "https://meli.la/2rcRAkj",
  "https://meli.la/1eux19R",
  "https://meli.la/2TW6mcA",
  "https://meli.la/2zKbYe2",
  "https://meli.la/31nWF5s",
  "https://meli.la/2NLzkAC",
  "https://meli.la/2vpVLGy",
  "https://meli.la/1xbTbRq",
  "https://meli.la/27c2eHs",
  "https://meli.la/24mMPYg",
  "https://meli.la/329ZmPQ",
  "https://meli.la/1JF8LRV",
  "https://meli.la/1eEvqQ1",
  "https://meli.la/2j2MEFd",
  "https://meli.la/2cr2Dpe",
  "https://meli.la/2zdMYYV",
  "https://meli.la/23NUVfT",
  "https://meli.la/2mf1V1E",
  "https://meli.la/11xL6m6",
  "https://meli.la/15ZyPj3",
  "https://meli.la/1KhodWe",
  "https://meli.la/2Ey7g8K",
  "https://meli.la/1Se5wBg",
  "https://meli.la/2yuX8Uy",
  "https://meli.la/2eWuJnm",
  "https://meli.la/1HqHurc",
  "https://meli.la/23nHTVo",
  "https://meli.la/1NahHmE",
  "https://meli.la/2dz6CYa",
  "https://meli.la/2YA8pXB",
  "https://meli.la/1nNRBgf",
  "https://meli.la/192h9RM",
  "https://meli.la/1d7Ldmv",
  "https://meli.la/13hRwJE",
  "https://meli.la/1jUve4Q",
  "https://meli.la/2NtV3h4",
  "https://meli.la/2DhDf6p",
  "https://meli.la/2K7ab34",
  "https://meli.la/1nsuBXQ",
  "https://meli.la/2MqCyHk",
  "https://meli.la/1DddM4G",
  "https://meli.la/293Pyg6",
  "https://meli.la/2vXV4uz",
  "https://meli.la/1syNfPu",
  "https://meli.la/2UYMav9",
  "https://meli.la/2na2LW7",
  "https://meli.la/1arLTD3",
  "https://meli.la/34bDwXY",
  "https://meli.la/2UBEhMD",
  "https://meli.la/2zV8Y1L",
  "https://meli.la/1FN5P2n",
  "https://meli.la/2dD5ps2",
  "https://meli.la/2vDaJbF",
  "https://meli.la/2c5HYeH",
  "https://meli.la/1PGuvFs",
  "https://meli.la/2LiqDpH",
  "https://meli.la/11pnFzh",
  "https://meli.la/2EL6Xdh",
  "https://meli.la/1kuwm5z",
  "https://meli.la/2t1rwhM",
  "https://meli.la/1sAnpz1",
  "https://meli.la/2SCn6UN",
  "https://meli.la/1bdZaKE",
  "https://meli.la/2q4qifn",
  "https://meli.la/23zwtbr",
  "https://meli.la/2wDow9g",
  "https://meli.la/2JqLQyo",
  "https://meli.la/191K8WJ",
  "https://meli.la/13UFLBM",
  "https://meli.la/2YbWvDA",
  "https://meli.la/2Eg9q4v",
  "https://meli.la/1W8H7eg",
  "https://meli.la/2C15U74",
  "https://meli.la/1Tej1eS",
  "https://meli.la/1x5ohPp",
  "https://meli.la/2yBvK4p",
  "https://meli.la/2C1eNMw",
  "https://meli.la/2rECT1V",
  "https://meli.la/1dpLTRq",
  "https://meli.la/1QT7EFg",
  "https://meli.la/1Ym9VHe",
  "https://meli.la/29M2HCy",
  "https://meli.la/1gJb46L",
  "https://meli.la/1Aen6XP",
  "https://meli.la/2xNTrmX",
  "https://meli.la/1mV1SUP",
  "https://meli.la/2TvD1vQ",
  "https://meli.la/2NCuyD7",
  "https://meli.la/326Hw2S",
  "https://meli.la/1tnTYXo",
  "https://meli.la/1VhRv8R",
  "https://meli.la/1B8XADN",
  "https://meli.la/1sXiBbT",
  "https://meli.la/1hddSCp",
  "https://meli.la/2rxzvoe",
  "https://meli.la/1mT8EF9",
  "https://meli.la/2D3n6oK",
  "https://meli.la/1W4hHPi",
  "https://meli.la/2zgKk23",
  "https://meli.la/2fDUA7E",
  "https://meli.la/1MSYgsM",
  "https://meli.la/1ZQ1qZg",
  "https://meli.la/2ST2wXx",
  "https://meli.la/1L3Szs9",
  "https://meli.la/2eh7KMQ",
  "https://meli.la/1d8TgMt",
  "https://meli.la/2DXAzj3",
  "https://meli.la/1YjahcR",
  "https://meli.la/1NDkSD8",
  "https://meli.la/2TcTUCz",
  "https://meli.la/1ecZXr9",
  "https://meli.la/2SWyRRT",
  "https://meli.la/1vi5heu",
  "https://meli.la/1dXHAK9",
  "https://meli.la/1d7vnc8",
  "https://meli.la/2G4SjBL",
  "https://meli.la/22ztFQc",
  "https://meli.la/2xZ1LRK",
  "https://meli.la/2MsvDxv",
  "https://meli.la/1J4XyRQ",
  "https://meli.la/1qimVkc",
  "https://meli.la/34necuV",
  "https://meli.la/1BPMeuh",
  "https://meli.la/2nbGq9y",
  "https://meli.la/2wFUs8s",
  "https://meli.la/15REDcA",
  "https://meli.la/31eKUbq",
  "https://meli.la/1SqkmzN",
  "https://meli.la/21NCfJh",
  "https://meli.la/1xq7QeP",
  "https://meli.la/2KwLDwB",
  "https://meli.la/1sPM7EV",
  "https://meli.la/1xQUiho",
  "https://meli.la/1vKYSyk",
  "https://meli.la/1rCTWcd"
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