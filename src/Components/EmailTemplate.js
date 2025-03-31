
export const EmailTemplate = ({
  nome,
  email,
  escolhahorario,
  cupom,
  endereco,
  cidade,
  cpf
}) => {
  return `
    <h1>Olá ${nome}!</h1>
    <div style="max-width:37.5em;padding:20px;margin:0 auto;background-color:#eee">
      <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff">
        <tr>
          <td>
            <div style="background-color:#000;padding:20px 0;text-align:center">
              <img src="https://raw.githubusercontent.com/Srubens/lp-touti/main/public/touti-branco.png" alt="touti logo" width="200"/>
            </div>
            
            <div style="padding:25px 35px">
              <h1 style="color:#333;font-family:sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px">
                Olá, ${nome}!<br/>
                Seu cadastro foi realizado com sucesso!
              </h1>
              
              <p style="font-family:sans-serif;font-size:14px;line-height:24px;margin:24px 0">
                O brinde poderá ser retirado no ${cidade}, ${endereco}
              </p>
              
              <p style="font-family:sans-serif;font-size:14px;line-height:24px;margin:24px 0;">
                Ao chegar, vá ao balcão de atendimento e informe que deseja retirar seu brinde.<br/>
                Apresente um documento oficial com foto (como RG, CNH ou passaporte).<br/>
                Informe o seu código para retirada: ${cupom}<br/>
                Após a verificação, o brinde será entregue a você!<br/>
                Não se esqueça de comparecer no horário cadastrado para garantir a entrega do seu brinde.<br/>
                Se tiver alguma dúvida, nossa equipe está à disposição para ajudar.<br/>
                Atenciosamente,<br/>
                Touti Cosmetics
              </p>
              
              <div style="text-align:center;margin:30px 0">
                <p style="font-family:sans-serif;font-size:14px;font-weight:bold;margin:0">Cupom:</p>
                <p style="font-family:sans-serif;font-size:36px;font-weight:bold;margin:10px 0">${cupom}</p>
                <p style="font-family:sans-serif;font-size:14px;margin:0">${escolhahorario}</p>
              </div>
            </div>
            
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea" />
            
            <div style="padding:25px 35px">
              <p style="font-family:sans-serif;font-size:12px;margin:24px 0;padding:0 20px;text-align:center">
                Esta mensagem foi feita pela Touti Cosmetics © 2025. Todos os direitos reservados.
              </p>
            </div>
          </td>
        </tr>
      </table>
      
      
    </div>
  `
}