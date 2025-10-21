document.addEventListener('DOMContentLoaded', () => {
   
    const botaoAdicionar = document.getElementById('adicionar-produto');
    const botaoSalvar = document.getElementById('salvar-pedidos');
    const listaPedidos = document.getElementById('lista-pedidos'); 
    const totalElemento = document.getElementById('total-elemento'); 
    const nomeProdutoInput = document.getElementById('nome-produto');
    const precoProdutoInput = document.getElementById('preco-produto');


    let total = 0;
    let pedidosData = []; 


    botaoAdicionar.addEventListener('click', () => {
        const nomeProduto = nomeProdutoInput.value.trim();
        const precoProdutoStr = precoProdutoInput.value.replace(',', '.');
        const precoProduto = parseFloat(precoProdutoStr);

       
        if (nomeProduto && !isNaN(precoProduto) && precoProduto > 0) {

   
            const li = document.createElement('li');

           
            const precoFormatado = precoProduto.toFixed(2).replace('.', ',');

            li.innerHTML = `
            ${nomeProduto} - R$ ${precoFormatado}
            <button class="remover" data-nome="${nomeProduto}" data-preco="${precoProduto}">Remover</button>
            `;

          
            listaPedidos.appendChild(li);

          
            total += precoProduto;
            totalElemento.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

         
            pedidosData.push({ nome: nomeProduto, preco: precoProduto });

        
            nomeProdutoInput.value = '';
            precoProdutoInput.value = '';

      
            const botaoRemover = li.querySelector('.remover');

            botaoRemover.addEventListener('click', () => {
                const nomeParaRemover = botaoRemover.getAttribute('data-nome');
                const precoParaRemover = parseFloat(botaoRemover.getAttribute('data-preco'));

              
                li.remove();

         
                total -= precoParaRemover;
                totalElemento.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

           
                let itemRemovido = false; 
                pedidosData = pedidosData.filter(item => {
                    if (itemRemovido) return true; 

                    const corresponde = item.nome === nomeParaRemover && item.preco === precoParaRemover;

                    if (corresponde) {
                        itemRemovido = true; 
                        return false; 
                    }
                    return true; 
                });

            });

        } else {
            alert('Por favor, insira um nome e um preço válido (maior que zero).');
        }
    });


    botaoSalvar.addEventListener('click', async () => {

        if (pedidosData.length === 0) {
            alert('Nenhum produto para salvar.');
            return;
        }

        const dadosParaEnviar = {
            pedidos: pedidosData,
            total: total.toFixed(2),
        };

        try {
            const response = await fetch('/salvar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaEnviar),
            });

            const respostaTexto = await response.text();

            if (response.ok) {
                alert(respostaTexto);

              
                pedidosData = [];
                total = 0;
                listaPedidos.innerHTML = ''; 
                totalElemento.textContent = 'Total: R$ 0,00';
            } else {
                alert(`Erro ao salvar: ${respostaTexto}`);
            }

        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro de comunicação com o servidor. Tente novamente.');
        }
    });

});
