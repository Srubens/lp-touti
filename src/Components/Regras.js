"use client"
import { useState } from "react";

function Reagras(){

    const [openFaq, setOpenFaq] = useState({});

    const toggleFaq = (index) => {
        setOpenFaq(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const faqItems = [
        {
            question: "Posso retirar quantos brindes por CPF?",
            answer: "Apenas um brinde por CPF."
        },
        {
            question: "Posso retirar em qualquer horário?",
            answer: "Não, apenas no local, data e horário selecionado."
        },
        {
            question: "E se eu não conseguir retirar o brinde na data e horário escolhida?",
            answer: "Fique atento(a) ao seu e-mail e nossas redes sociais. Terão outras oportunidades!"
        }
    ];

    return(
        <>
        <div className="box-rules">
            <div className="flex justify-center flex-col items-center" >
                <div className="faq w-full">
                    <h3 className="text-xl font-bold mb-6">Regras da campanha</h3>
                    
                    {faqItems.map((item, index) => (
                        <div key={index} className="mb-4">
                            <button 
                                onClick={() => toggleFaq(index)}
                                className="flex justify-between items-center w-full text-left font-bold p-2 hover:bg-gray-50 rounded"
                            >
                                {item.question}
                                <span className="ml-2">{openFaq[index] ? '−' : '+'}</span>
                            </button>
                            {openFaq[index] && (
                                <p className="p-2">{item.answer}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="social-links flex flex-col mt-4">
                    <p className="mb-5 m-auto" ><strong>Siga-nos nas redes sociais</strong></p>
                    <div className="social-icons flex flex-row gap-5 text-center">
                        <a href="https://touti.com.br/" target="_blank" className="social-link flex flex-col">
                            <svg strokeWidth="1.5" className="social-icon m-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="mt-4" >Site Oficial</span>
                        </a>
                        <a href="https://www.instagram.com/touticosmetics/" target="_blank" className="social-link flex flex-col"  >
                            <svg strokeWidth="1.5" className="social-icon m-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="17" cy="7" r="1" fill="currentColor"/>
                            </svg>
                            <span className="mt-4" >Instagram</span>
                        </a>
                    <a href="https://www.tiktok.com/@touti.cosmetics" target="_blank" className="social-link flex flex-col" >
                        <svg strokeWidth="1.5" className="social-icon m-auto" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13 3.4 14.4 4.4 16 4.7V10.6H14V8.3C12.5 7.9 11.2 7 10.3 5.8V15.6C10.3 17.1 9 18.4 7.4 18.4C5.9 18.4 4.6 17.1 4.6 15.6C4.6 14.1 5.9 12.8 7.4 12.8C7.6 12.8 7.9 12.8 8.1 12.9V10.2C7.9 10.1 7.6 10.1 7.4 10.1C4.1 10.1 1.5 12.6 1.5 15.6C1.5 18.6 4.1 21.1 7.4 21.1C10.7 21.1 13.3 18.6 13.3 15.6V5.7C14.6 6.7 16.1 7.2 17.7 7.3V2H12Z"/>
                        </svg>
                        <span className="mt-4" >TikTok</span>
                    </a>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}
export default Reagras;