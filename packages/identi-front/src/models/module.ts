export type OptionQuestion = {
  name: string;
  display_name: string;
  position: number;
};

export type Question = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  type: string;
  // color: string;
  // icon: string;
  is_required?: boolean;
  is_unique?: boolean;
  is_multiple?: boolean;
  options?: OptionQuestion[];
};

export type Module = {
  id: string;
  name: string;
  type: string;
  image?: string;
  can_see?: string;
  date_active?: string;
  questions?: Question[];
};

export const ModuleDefault: Module = {
  id: '',
  name: '',
  type: '',
  image: '',
  can_see: 'all',
  date_active: 'always'
};

export const QuestionDefault: Question = {
  id: '444565565656',
  name: '',
  display_name: 'Texto largo',
  description: '',
  type: 'long_text'
  // color: '#C6E2F9',
  // icon: 'format_align_left'
};

export const ModuleFake: Module = {
  id: '123456789',
  name: 'Modulo de pruebas',
  type: 'vertical',
  image: '',
  can_see: 'all',
  date_active: 'always',
  questions: []
};

export type Tool = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  type: string;
  color: string;
  icon: string;
};

export type QuestionList = {
  group: string;
  name: string;
  questions: Tool[];
};

export const QuestionsSelect: QuestionList[] = [
  {
    group: '23432456542342',
    name: 'Opciones',
    questions: [
      {
        id: '',
        name: '',
        display_name: 'Desplegable',
        description: '',
        type: 'dropdown',
        color: '#FCA5A5',
        icon: 'keyboard_arrow_down'
      },
      {
        id: '',
        name: '',
        display_name: 'Opción multiple',
        description: '',
        type: 'multiple_option',
        color: '#FCA5A5',
        icon: 'check'
      },
      {
        id: '',
        name: '',
        display_name: 'Si/No',
        description: '',
        type: 'boolean',
        color: '#FCA5A5',
        icon: 'vertical_shades'
      }
    ]
  },
  {
    group: '32423433',
    name: 'Texto',
    questions: [
      {
        id: '',
        name: '',
        display_name: 'Texto corto',
        description: '',
        type: 'short_text',
        color: '#C6E2F9',
        icon: 'notes'
      },
      {
        id: '',
        name: '',
        display_name: 'Texto largo',
        description: '',
        type: 'long_text',
        color: '#C6E2F9',
        icon: 'format_align_left'
      }
    ]
  },
  {
    group: '546457657',
    name: 'Número',
    questions: [
      {
        id: '',
        name: '',
        display_name: 'Número',
        description: '',
        type: 'number',
        color: '#FDE68A',
        icon: 'tag'
      }
    ]
  },
  {
    group: 'asd1234234',
    name: 'Multimedia',
    questions: [
      {
        id: '',
        name: '',
        display_name: 'Foto',
        description: '',
        type: 'photo',
        color: '#BBF7D0',
        icon: 'add_a_photo'
      }
    ]
  },
  {
    group: '34534534534',
    name: 'Información de contacto',
    questions: [
      {
        id: '',
        name: '',
        display_name: 'Punto georeferencial',
        description: '',
        type: 'gps_point',
        color: '#BBF7D0',
        icon: 'place'
      }
    ]
  }
];
