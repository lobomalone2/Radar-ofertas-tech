const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/1pZoRLs",
  "https://meli.la/1pZoRLs",
  "https://meli.la/1Qcpv5a",
  "https://meli.la/2kd1vyh",
  "https://meli.la/335cwoR",
  "https://meli.la/14Uio7S",
  "https://meli.la/2sXCBqA",
  "https://meli.la/16jXXoB",
  "https://meli.la/1UyLj9j",
  "https://meli.la/1CLrAqd",
  "https://meli.la/1QK9oho",
  "https://meli.la/1qUueUr",
  "https://meli.la/2jKGknr",
  "https://meli.la/2GTk1EX",
  "https://meli.la/1uA8Qrm",
  "https://meli.la/14Mwfsq",
  "https://meli.la/2nKExhJ",
  "https://meli.la/2NekPmp",
  "https://meli.la/2gEm6YS",
  "https://meli.la/1712G1R",
  "https://meli.la/1Z85srE",
  "https://meli.la/1CsPfdG",
  "https://meli.la/1At3tPg",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2m4scDC",
  "https://meli.la/19M1Dji",
  "https://meli.la/1YVekEP",
  "https://meli.la/2hu1Tgj",
  "https://meli.la/1hhtuiP",
  "https://meli.la/1trhS6M",
  "https://meli.la/1cGuQHj",
  "https://meli.la/1jhjmL2",
  "https://meli.la/2fN8Zdd",
  "https://meli.la/1jEePf5",
  "https://meli.la/1VvAdbu",
  "https://meli.la/1MhEpQA",
  "https://meli.la/11W3F7Z",
  "https://meli.la/1Vz1Emi",
  "https://meli.la/2Y3FPw3",
  "https://meli.la/1V9QL1k",
  "https://meli.la/2VHN1dG",
  "https://meli.la/1qEq6tE",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/1x4EG9w",
  "https://meli.la/2Y3FPw3",
  "https://meli.la/2uVXX7N",
  "https://meli.la/2d33hrF",
  "https://meli.la/2KF5fmh",
  "https://meli.la/21eURV2",
  "https://meli.la/2EMe6Qd",
  "https://meli.la/15ifpdU",
  "https://meli.la/141VhYm",
  "https://meli.la/1ZfWgjS",
  "https://meli.la/18FkD9r",
  "https://meli.la/2wSP9fN",
  "https://meli.la/1w6jAYk",
  "https://meli.la/2WyDnp1",
  "https://meli.la/2wBDh6d",
  "https://meli.la/2QE7Pds",
  "https://meli.la/2n3LY2E",
  "https://meli.la/2FQCZqR",
  "https://meli.la/2X5JPih",
  "https://meli.la/2a26JRs",
  "https://meli.la/2Jh1bNF",
  "https://meli.la/2CETcb7",
  "https://meli.la/2w7skZe",
  "https://meli.la/1y1Fez2",
  "https://meli.la/1ip9GFN",
  "https://meli.la/26A3Au7",
  "https://meli.la/1RFjmdv",
  "https://meli.la/2PLnV9a",
  "https://meli.la/2bUDE2x",
  "https://meli.la/1nKZ59e",
  "https://meli.la/2fZV5xq",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/2bUDE2x",
  "https://meli.la/1ELwnpi",
  "https://meli.la/1BUkujJ",
  "https://meli.la/1ChnVA3",
  "https://meli.la/196YRhy",
  "https://meli.la/2W3CdYQ",
  "https://meli.la/1sY5XSt",
  "https://meli.la/2N1Pkmf",
  "https://meli.la/2gdbo3Y",
  "https://meli.la/1V1x254",
  "https://meli.la/1thb2uf",
  "https://meli.la/1EZEdCw",
  "https://meli.la/1raZXtM",
  "https://meli.la/1V1x254",
  "https://meli.la/1YGQa6S",
  "https://meli.la/1kTTcBP",
  "https://meli.la/1DzmtcF",
  "https://meli.la/2VgHUmG",
  "https://meli.la/14PdAEH",
  "https://meli.la/1ojKWWh",
  "https://meli.la/1b6kugM",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/2zPeZNk",
  "https://meli.la/2a6cfzd",
  "https://meli.la/2zPeZNk",
  "https://meli.la/23kmn1S",
  "https://meli.la/2Z25X6F",
  "https://meli.la/167Lwss",
  "https://meli.la/1kULJf7",
  "https://meli.la/2kY5Qz5",
  "https://meli.la/1RNvTKc",
  "https://meli.la/22B1uSy",
  "https://meli.la/2H6ZfuF",
  "https://meli.la/17ikZpt",
  "https://meli.la/1j8CQme",
  "https://meli.la/2Bh4ptk",
  "https://meli.la/266Mx4b",
  "https://meli.la/1SUo33d",
  "https://meli.la/1MHTDWY",
  "https://meli.la/2FJrwsB",
  "https://meli.la/2URjExj",
  "https://meli.la/2Fpv2Ap",
  "https://meli.la/1SgMwah",
  "https://meli.la/2rKYUAE",
  "https://meli.la/2xTA8yu",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/1ec1goD",
  "https://meli.la/1rfmWot",
  "https://meli.la/2q4SwQf",
  "https://meli.la/1ec1goD",
  "https://meli.la/2CYx6Ei",
  "https://meli.la/14x6Hq5",
  "https://meli.la/2hswAtY",
  "https://meli.la/11bjqDU",
  "https://meli.la/2vCwsfs",
  "https://meli.la/1orZcAy",
  "https://meli.la/1MFF8Pq",
  "https://meli.la/2VVJD8o",
  "https://meli.la/2gAirwb",
  "https://meli.la/1ZrHQQW",
  "https://meli.la/1ZrHQQW",
  "https://meli.la/1eyLh4i",
  "https://meli.la/1eyLh4i",
  "https://meli.la/23d66Jy",
  "https://meli.la/28WjL8L"
]

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