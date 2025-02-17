function enviarDados() {
    const solicitante = document.getElementById("solicitante").value;
    const recebedor = document.getElementById("recebedor").value;
    const cpf_cnpj = document.getElementById("cpf_cnpj").value;
    const pix = document.getElementById("pix").value;
    const banco = document.getElementById("banco").value;
    const agencia = document.getElementById("agencia").value;
    const conta = document.getElementById("conta").value;
    const tipo_conta = document.getElementById("tipo_conta").value;
    const servicos = document.getElementById("servicos").value;
    const valor = document.getElementById("valor").value;
    const data_servico = document.getElementById("data_servico").value;
    const data_pagamento = document.getElementById("data_pagamento").value;
    const centro_custo = document.getElementById("centro_custo").value;
    const local = document.getElementById("local").value;
    const autorizado = document.getElementById("autorizado").value;  // Novo campo

    // Validação de campos obrigatórios
    if (!solicitante || !recebedor || !cpf_cnpj || !servicos || !valor || !data_servico || !data_pagamento || !centro_custo || !local || !autorizado) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return; // Impede o envio caso algum campo não esteja preenchido
    }

    // Envio dos dados para o Excel através da API SheetMonkey
    fetch("https://api.sheetmonkey.io/form/b2cwo2nua4kmJ4nDtVL5Ni", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            solicitante: solicitante,
            recebedor: recebedor,
            cpf_cnpj: cpf_cnpj,
            pix: pix,
            banco: banco,
            agencia: agencia,
            conta: conta,
            tipo_conta: tipo_conta,
            servicos: servicos,
            valor: valor,
            data_servico: data_servico,
            data_pagamento: data_pagamento,
            centro_custo: centro_custo,
            local: local,
            autorizado: autorizado,  // Adicionando o novo campo
            status: "Pendente"
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Exibir mensagem de agradecimento após sucesso
            const mensagem = document.createElement("div");
            mensagem.textContent = "Obrigado por USAR O NOSSOS SERVIÇOS!";
            mensagem.style.fontSize = "20px";
            mensagem.style.fontWeight = "bold";
            mensagem.style.color = "green";
            mensagem.style.textAlign = "center";
            mensagem.style.marginTop = "20px";
            document.body.appendChild(mensagem); // Adiciona a mensagem na página
        }
    })
    .catch(error => {
        console.error("Erro ao enviar os dados:", error);
    });

    // Geração do PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = 'logo.png'; 
    const logoWidth = 80; 
    const logoHeight = 60; 

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = logo;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.globalAlpha = 0.1; 
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");

        const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
        const logoY = (doc.internal.pageSize.height - logoHeight) / 6;

        doc.addImage(dataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Recibo de Pagamento", 105, 20, null, null, "center");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        const startY = 50;
        doc.text(`Solicitante: ${solicitante}`, 20, startY);
        doc.text(`Recebedor: ${recebedor}`, 20, startY + 10);
        doc.text(`CPF/CNPJ: ${cpf_cnpj}`, 20, startY + 20);
        doc.text(`Chave PIX: ${pix}`, 20, startY + 30);
        doc.text(`Banco: ${banco}`, 20, startY + 40);
        doc.text(`Agência: ${agencia}`, 20, startY + 50);
        doc.text(`Conta: ${conta}`, 20, startY + 60);
        doc.text(`Tipo de Conta: ${tipo_conta}`, 20, startY + 70);
        doc.text(`Serviço Realizado: ${servicos}`, 20, startY + 80);
        doc.text(`Valor: R$ ${valor}`, 20, startY + 90);
        doc.text(`Data do Serviço: ${data_servico}`, 20, startY + 100);
        doc.text(`Data de Pagamento: ${data_pagamento}`, 20, startY + 110);
        doc.text(`Centro de Custo: ${centro_custo}`, 20, startY + 120);
        doc.text(`Local do Serviço: ${local}`, 20, startY + 130);
        doc.text(`Autorizado por: ${autorizado}`, 20, startY + 140);  // Novo campo no PDF

        doc.setLineWidth(0.5);
        doc.line(20, startY + 150, 190, startY + 150);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Obrigado por utilizar nossos serviços!", 105, startY + 160, null, null, "center");

        doc.save(`Recibo_${solicitante}.pdf`);
    };
}
