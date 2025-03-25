'use client'
import Image from 'next/image'
import { useState, useEffect } from "react";
import moment from 'moment';
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import Banner1 from '@/assets/Banner1.jpg';
import Reagras from '@/Components/Regras';
import { read, utils } from 'xlsx';
import "moment/locale/pt-br";

const formSchema = z.object({
  nome: z.string().min(4, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos').regex(/^\d+$/, 'CPF deve conter apenas números'),
  email: z.string().email('Email inválido'),
});

export default function Home() {

  // MENSAGEM DE SUCESSO
  const successNotify = () => toast.success("Cadastro realizado com sucesso!", {
    position: "top-right",
    autoClose: 3000,
    style: {
      background: '#fff',
      color: '#22c55e'
    }
  });
  
  // MESSAGEM DE ERRO 
  const errorNotify = (message) => toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    style: {
      background: '#fff',
      color: '#ef4444'
    }
  });

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    ddd: '',
    celular: '',
    estado: '',
    cidade: '',
    clienteTouti: '',
    escolhahorario: '',
    data: moment().format("YYYY/MM/DD hh:mm:ss"),
    aceitaTermos: false,
    saurus:'',
  });

  // Adicionar novo estado para erros
  const [errors, setErrors] = useState({});


  // Adicionar função para verificar se o formulário está válido
  const isFormValid = () => {
    const hasNoErrors = Object.values(errors).every(error => error === '');
    const requiredFields = 
      formData.nome.trim() !== '' && 
      formData.email.trim() !== '' && 
      formData.escolhahorario !== '' && 
      formData.aceitaTermos === true;
    
    return hasNoErrors && requiredFields;
  };

  //CHECA SE EXISTE EMAIL OU CPF NO BANCO
  const checkExistingUser = async (email, cpf) => {
    try {
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, cpf }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Erro ao verificar dados' };
    }
  };

  //CUPOM GENERATE
  const generateCupom = () => {
    return 'TOUTI - ' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // SUBMIT DO FORMULARIO 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const cupom = generateCupom();
      const currentData = moment().format("YYYY-MM-DD HH:mm:ss");
      // Verificar se usuário já existe
      const checkResult = await checkExistingUser(formData.email, formData.cpf);
      
      if (checkResult.exists) {
        errorNotify(checkResult.message);
        return;
      }

      // Se não existe, prossegue com o cadastro
      const response = await fetch('/api/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, cupom}),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
  
      const result = await response.json();
  
      if (result.success) { 

        console.log('Dados para envio de email:', {
          nome: formData.nome,
          email: formData.email,
          escolhahorario: formData.escolhahorario,
          cupom: cupom
        });

        const emailResponse = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            escolhahorario: formData.escolhahorario,
            cupom: cupom,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log('Resposta do envio de email:', emailResult);

        successNotify();

        // Atualizar horários ocupados após cadastro bem-sucedido
        const horariosResponse = await fetch('/api/check-horario');
        const horariosData = await horariosResponse.json();
        if (horariosData.success) {
          setHorariosOcupados(horariosData.horariosOcupados);
        }

        setFormData({
          nome: '',
          cpf: '',
          email: '',
          ddd: '',
          celular: '',
          estado: '',
          cidade: '',
          clienteTouti: '',
          escolhahorario: '',
          data: moment().format("YYYY-MM-DD HH:mm:ss"),
          aceitaTermos: false,
        });
        
      } else {
        errorNotify(result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('Erro:', error);
      errorNotify('Erro ao conectar com o servidor');
    }
};

  // Atualizar handleChange para incluir validação
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'escolhahorario' && value) {
      // Find the selected horario in the getNextFiveDays data
      const allDays = getNextFiveDays();
      const selectedHorario = allDays.flatMap(day => day.horarios).find(h => h.label === value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        saurus: selectedHorario ? selectedHorario.saurus : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }

    // Validar campo se for nome, cpf ou email
    if (['nome', 'cpf', 'email'].includes(name)) {
      try {
        formSchema.shape[name].parse(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
      }
    }
  };

  const [horariosOcupados, setHorariosOcupados] = useState({});

  useEffect(() => {
  
    // CHECAGEM DO HORAIO SE ESTA OU NÃO OCUPADO
    const fetchHorariosOcupados = async () => {
      try {
        const response = await fetch('/api/check-horario'); // Corrigir o nome da rota
        const data = await response.json();
        if (data.success) {
          console.log('Horários ocupados:', data.horariosOcupados); // Debug
          setHorariosOcupados(data.horariosOcupados);
        }
      } catch (error) {
        console.error('Erro ao buscar horários:', error);
      }
    };
  
    fetchHorariosOcupados();
    const interval = setInterval(fetchHorariosOcupados, 10000); // Atualizar a cada 10 segundos
  
    return () => clearInterval(interval);
  }, []);

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

// Adicionar função para buscar estados
useEffect(() => {
  const fetchEstados = async () => {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      const data = await response.json();
      setEstados(data);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
    }
  };

  fetchEstados();
}, []);

useEffect(() => {
  const fetchCidades = async () => {
    if (formData.estado) {
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios`);
        const data = await response.json();
        setCidades(data);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      }
    } else {
      setCidades([]);
    }
  };

  fetchCidades();
}, [formData.estado]);

// LOJAS E SAURUS E ESTADO
const [locations, setLocations] = useState([]);

// Adicionar useEffect para carregar o Excel
useEffect(() => {
  const loadLocations = async () => {
    try {
      const response = await fetch('/data/lojas.xlsx');
      if (!response.ok) {
        throw new Error('Arquivo não encontrado');
      }
      const arrayBuffer = await response.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(worksheet);
      // console.log('Dados do Excel:', data);
      setLocations(data);
    } catch (error) {
      // console.error('Erro ao carregar locais:', error);
      setLocations([]);
    }
  };
  loadLocations();
}, []);

const getNextFiveDays = () => {
  const days = [];
  
  if (!formData.estado || !locations.length) {
    return days;
  }

  // Filtrar locais pelo estado selecionado
  const stateLocations = locations.filter(loc => loc.UF === formData.estado);
  console.log('lojas encontradas: ', stateLocations);

  // Se não encontrar lojas para o estado, usar Shopping como padrão
  if (stateLocations.length === 0) {
    const horarios = [
      { value: 'horario1', label: '10h - 13h' },
      { value: 'horario2', label: '13h - 18h' },
      { value: 'horario3', label: '18h - 22h' }
    ];

    for (let i = 1; i <= 5; i++) {
      const day = moment().add(i, 'days');
      days.push({
        date: day.format('DD/MM'),
        local: 'Shopping',
        horarios: horarios.map(horario => ({
          value: `${day.format('YYYY-MM-DD')}_Shopping_${horario.value}`,
          label: `Shopping ${day.format('DD/MM')} - ${horario.label}`
        }))
      });
    }
  } else {
    // Usar as lojas encontradas no Excel
    stateLocations.forEach(location => {
      const local = location.LOJA;
      
      const horarios = [
        { value: 'horario1', label: '10h - 13h' },
        { value: 'horario2', label: '13h - 18h' },
        { value: 'horario3', label: '18h - 22h' }
      ];

      for (let i = 1; i <= 5; i++) {
        const day = moment().add(i, 'days');
        days.push({
          date: day.format('DD/MM'),
          local: local,
          horarios: horarios.map(horario => ({
            value: `${day.format('YYYY-MM-DD')}_${local}_${horario.value}`,
            label: `${local} ${day.format('DD/MM')} - ${horario.label}`,
            saurus: location.SAURUS,
          })),
        });
      }
      
    });
  }

  console.log('Dias: ', days);
  return days;
};

  return (
    <>
    <div className='box_form container p-4 rounded-md sm:p-6 md:p-8 rounded-md w-[21.875rem] sm:w-[35rem] lg:w-[50rem] mx-auto' >
      <div className='mb-4 flex mx-auto justify-center w-full rounded-md'>
        <Image 
          src={Banner1}
          alt="imagem do produto"
          width={736}
          height={386}
          className='imgBanner block img_banner'
        />
      </div>

      {/* AQUI VEM O DEBUG */}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block mb-2">Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.nome ? 'border-red-500' : ''}`}
            required
            placeholder='Nome e Sobrenome'
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="block mb-2">CPF:</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.cpf ? 'border-red-500' : ''}`}
            required 
            placeholder='Somente números'
          />
          {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
        </div>

        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
            required
            placeholder='e-mail'
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="flex gap-4">
          <div className="w-1/4">
            <label className="block mb-2">DDD:</label>
            <input
              type="text"
              name="ddd"
              value={formData.ddd}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="2"
              required
              placeholder='DDD'
            />
          </div>
          <div className="w-3/4">
            <label className="block mb-2">Celular:</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required 
              placeholder='Somente números'
            />
          </div>
        </div>

        <div className="flex gap-4" >
          <div className="w-1/4">
            <label className="block mb-2">Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required 
              placeholder="UF"
            >
              <option value="">UF</option>
              {estados.map(estado => (
                <option key={estado.id} value={estado.sigla}>
                  {estado.sigla}
                </option>
              ))}
            </select>

          </div>
          <div className="w-3/4">
            <label className="block mb-2">Cidade:</label>
            <select
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={!formData.estado}
            >
              <option value="">Selecione uma cidade</option>
              {cidades.map(cidade => (
                <option key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2">Escolha a data e horário:</label>
          <select
            name="escolhahorario"
            value={formData.escolhahorario}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione um horário</option>
            {getNextFiveDays().flatMap(day => 
              day.horarios.map(horario => {
                const isDisabled = (horariosOcupados[horario.label] || 0) >= 2;
                return (
                  <option 
                    key={horario.value} 
                    value={horario.label}
                    disabled={isDisabled}
                  >
                    {horario.label}
                    {isDisabled ? ' (Esgotado)' : ''}
                    
                  </option>
                );
              })
            )}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            Você já comprou na Touti?
          </label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                name="clienteTouti"
                value="sim"
                checked={formData.clienteTouti === 'sim'}
                onChange={handleChange}
              /> Sim
            </label>
            <label>
              <input
                type="radio"
                name="clienteTouti"
                value="nao"
                checked={formData.clienteTouti === 'nao'}
                onChange={handleChange}
              /> Não
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="aceitaTermos"
              checked={formData.aceitaTermos}
              onChange={handleChange}
              required
            />
            <span>Aceito os termos e condições</span>
          </label>
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded ${
            isFormValid()
              ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
          disabled={!isFormValid()}
        >
          Cadastrar
        </button>
        <ToastContainer />
      </form>
    </div>
      <Reagras/>
    </>
  );
}
