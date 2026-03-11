import { PrismaClient, Segmento } from '@prisma/client'

const prisma = new PrismaClient()

const municipios = [
  'Abdon Batista','Abelardo Luz','Agrolândia','Agronômica','Água Doce',
  'Águas de Chapecó','Águas Frias','Águas Mornas','Alfredo Wagner','Alto Bela Vista',
  'Anchieta','Angelina','Anita Garibaldi','Anitápolis','Antônio Carlos',
  'Apiúna','Arabutã','Araquari','Araranguá','Armazém',
  'Arroio Trinta','Arvoredo','Ascurra','Atalanta','Aurora',
  'Balneário Arroio do Silva','Balneário Barra do Sul','Balneário Camboriú','Balneário Gaivota','Balneário Piçarras',
  'Balneário Rincão','Bandeirante','Barra Bonita','Barra Velha','Bela Vista do Toldo',
  'Belmonte','Benedito Novo','Biguaçu','Blumenau','Bocaina do Sul',
  'Bom Jardim da Serra','Bom Jesus','Bom Jesus do Oeste','Bom Retiro','Bombinhas',
  'Botuverá','Braço do Norte','Braço do Trombudo','Brunópolis','Brusque',
  'Caçador','Caibi','Calmon','Camboriú','Campo Alegre',
  'Campo Belo do Sul','Campo Erê','Campos Novos','Canelinha','Canoinhas',
  'Capão Alto','Capinzal','Capivari de Baixo','Catanduvas','Caxambu do Sul',
  'Celso Ramos','Cerro Negro','Chapadão do Lageado','Chapecó','Cocal do Sul',
  'Concórdia','Cordilheira Alta','Coronel Freitas','Coronel Martins','Correia Pinto',
  'Corupá','Criciúma','Cunha Porã','Cunhataí','Curitibanos',
  'Descanso','Dionísio Cerqueira','Dona Emma','Doutor Pedrinho','Entre Rios',
  'Ermo','Erval Velho','Faxinal dos Guedes','Flor do Sertão','Florianópolis',
  'Formosa do Sul','Forquilhinha','Fraiburgo','Frei Rogério','Galvão',
  'Garopaba','Garuva','Gaspar','Governador Celso Ramos','Grão-Pará',
  'Gravatal','Guabiruba','Guaraciaba','Guaramirim','Guarujá do Sul',
  'Guatambú','Herval d\'Oeste','Ibiam','Ibicaré','Ibirama',
  'Içara','Ilhota','Imaruí','Imbituba','Imbuia',
  'Indaial','Iomerê','Ipira','Iporã do Oeste','Ipuaçu',
  'Ipumirim','Iraceminha','Irani','Irati','Irineópolis',
  'Itá','Itaiópolis','Itajaí','Itapema','Itapiranga',
  'Itapoá','Ituporanga','Jaborá','Jacinto Machado','Jaguaruna',
  'Jaraguá do Sul','Jardinópolis','Joaçaba','Joinville','José Boiteux',
  'Jupiá','Lacerdópolis','Lages','Laguna','Lajeado Grande',
  'Laurentino','Lauro Müller','Lebon Régis','Leoberto Leal','Lindóia do Sul',
  'Lontras','Luiz Alves','Luzerna','Macieira','Mafra',
  'Major Gercino','Major Vieira','Maracajá','Maravilha','Marema',
  'Massaranduba','Matos Costa','Meleiro','Mirim Doce','Modelo',
  'Mondaí','Monte Carlo','Monte Castelo','Morro da Fumaça','Morro Grande',
  'Navegantes','Nova Erechim','Nova Itaberaba','Nova Trento','Nova Veneza',
  'Novo Horizonte','Orleans','Otacílio Costa','Ouro','Ouro Verde',
  'Paial','Painel','Palhoça','Palma Sola','Palmeira',
  'Palmitos','Papanduva','Paraíso','Passo de Torres','Passos Maia',
  'Paulo Lopes','Pedras Grandes','Penha','Peritiba','Pescaria Brava',
  'Petrolândia','Pinhalzinho','Pinheiro Preto','Piratuba','Planalto Alegre',
  'Pomerode','Ponte Alta','Ponte Alta do Norte','Ponte Serrada','Porto Belo',
  'Porto União','Pouso Redondo','Praia Grande','Presidente Castello Branco','Presidente Getúlio',
  'Presidente Nereu','Princesa','Quilombo','Rancho Queimado','Rio das Antas',
  'Rio do Campo','Rio do Oeste','Rio do Sul','Rio dos Cedros','Rio Fortuna',
  'Rio Negrinho','Rio Rufino','Riqueza','Rodeio','Romelândia',
  'Salete','Saltinho','Salto Veloso','Sangão','Santa Cecília',
  'Santa Helena','Santa Rosa de Lima','Santa Rosa do Sul','Santa Terezinha','Santa Terezinha do Progresso',
  'Santiago do Sul','Santo Amaro da Imperatriz','São Bento do Sul','São Bernardino','São Bonifácio',
  'São Carlos','São Cristóvão do Sul','São Domingos','São Francisco do Sul','São João Batista',
  'São João do Itaperiú','São João do Oeste','São João do Sul','São Joaquim','São José',
  'São José do Cedro','São José do Cerrito','São Lourenço do Oeste','São Ludgero','São Martinho',
  'São Miguel da Boa Vista','São Miguel do Oeste','São Pedro de Alcântara','Saudades','Schroeder',
  'Seara','Serra Alta','Siderópolis','Sombrio','Sul Brasil',
  'Taió','Tangará','Tigrinhos','Tijucas','Timbé do Sul',
  'Timbó','Timbó Grande','Três Barras','Treviso','Treze de Maio',
  'Treze Tílias','Trombudo Central','Tubarão','Tunápolis','Turvo',
  'União do Oeste','Urubici','Urupema','Urussanga','Vargeão',
  'Vargem','Vargem Bonita','Vidal Ramos','Videira','Vitor Meireles',
  'Witmarsum','Xanxerê','Xavantina','Xaxim','Zortéa',
]

const empreendimentos = [
  { nome: 'TechVale Solutions', empreendedor: 'Ana Souza', municipio: 'Florianópolis', segmento: Segmento.TECNOLOGIA, contato: '(48) 99123-4567', ativo: true },
  { nome: 'CodeBridge Software', empreendedor: 'Pedro Lima', municipio: 'Florianópolis', segmento: Segmento.TECNOLOGIA, contato: 'pedro@codebridge.dev', ativo: true },
  { nome: 'DataSul Analytics', empreendedor: 'Mariana Oliveira', municipio: 'Joinville', segmento: Segmento.TECNOLOGIA, contato: '(47) 99876-5432', ativo: true },
  { nome: 'InnovaApp', empreendedor: 'Lucas Ferreira', municipio: 'Blumenau', segmento: Segmento.TECNOLOGIA, contato: 'lucas@innovaapp.com.br', ativo: false },
  { nome: 'Mercado Central SC', empreendedor: 'Roberto Santos', municipio: 'Joinville', segmento: Segmento.COMERCIO, contato: '(47) 3333-4444', ativo: true },
  { nome: 'Loja Vila Germânica', empreendedor: 'Helena Schmidt', municipio: 'Blumenau', segmento: Segmento.COMERCIO, contato: '(47) 98765-1234', ativo: true },
  { nome: 'EcoShop Ilha', empreendedor: 'Camila Martins', municipio: 'Florianópolis', segmento: Segmento.COMERCIO, contato: 'camila@ecoshop.com', ativo: true },
  { nome: 'Distribuidora Costa Sul', empreendedor: 'Jorge Almeida', municipio: 'Criciúma', segmento: Segmento.COMERCIO, contato: '(48) 3444-5555', ativo: false },
  { nome: 'Blumenau Têxtil', empreendedor: 'Maria Schmidt', municipio: 'Blumenau', segmento: Segmento.INDUSTRIA, contato: '(47) 91234-5678', ativo: false },
  { nome: 'MetalSul Estruturas', empreendedor: 'Fernando Costa', municipio: 'Joinville', segmento: Segmento.INDUSTRIA, contato: '(47) 3555-6666', ativo: true },
  { nome: 'Cerâmica Catarinense', empreendedor: 'Antônio Pereira', municipio: 'Criciúma', segmento: Segmento.INDUSTRIA, contato: '(48) 3666-7777', ativo: true },
  { nome: 'PlástiSul Embalagens', empreendedor: 'Renata Dias', municipio: 'Jaraguá do Sul', segmento: Segmento.INDUSTRIA, contato: 'renata@plastisul.ind.br', ativo: true },
  { nome: 'Consultoria Serra', empreendedor: 'Bruno Cardoso', municipio: 'Lages', segmento: Segmento.SERVICOS, contato: '(49) 99111-2222', ativo: true },
  { nome: 'Contábil Express', empreendedor: 'Patrícia Ramos', municipio: 'Chapecó', segmento: Segmento.SERVICOS, contato: '(49) 3222-3333', ativo: true },
  { nome: 'TurSC Viagens', empreendedor: 'Diego Nascimento', municipio: 'Balneário Camboriú', segmento: Segmento.SERVICOS, contato: 'diego@tursc.com.br', ativo: true },
  { nome: 'Clínica BemViver', empreendedor: 'Dra. Juliana Moura', municipio: 'Florianópolis', segmento: Segmento.SERVICOS, contato: '(48) 3777-8888', ativo: false },
  { nome: 'Agro Sul Orgânicos', empreendedor: 'Carlos Müller', municipio: 'Chapecó', segmento: Segmento.AGRONEGOCIO, contato: '(49) 98765-4321', ativo: true },
  { nome: 'Vinícola Vale Europeu', empreendedor: 'Giovanni Bortolotto', municipio: 'Videira', segmento: Segmento.AGRONEGOCIO, contato: '(49) 3444-5566', ativo: true },
  { nome: 'Laticínios Planalto', empreendedor: 'Sandra Kraus', municipio: 'São Joaquim', segmento: Segmento.AGRONEGOCIO, contato: 'sandra@laticiniosplanalto.com', ativo: true },
  { nome: 'AgroTech Sementes', empreendedor: 'Marcos Vieira', municipio: 'Xanxerê', segmento: Segmento.AGRONEGOCIO, contato: '(49) 99333-4444', ativo: false },
]

async function main() {
  await prisma.empreendimento.deleteMany()
  await prisma.municipio.deleteMany()

  await prisma.municipio.createMany({
    data: municipios.map(nome => ({ nome })),
  })

  await prisma.empreendimento.createMany({ data: empreendimentos })

  console.log(`Seeded ${municipios.length} municipalities and ${empreendimentos.length} empreendimentos`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
