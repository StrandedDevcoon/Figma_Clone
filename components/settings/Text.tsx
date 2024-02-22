import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const selectConfigs = [
  {
    property: "fontFamily",
    placeholder: "Choose a font",
    options: fontFamilyOptions,
  },
  { property: "fontSize", placeholder: "30", options: fontSizeOptions },
  {
    property: "fontWeight",
    placeholder: "Semibold",
    options: fontWeightOptions,
  },
];

type TextProps = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  handleInputChange: (property: string, value: string) => void;
};

const Text = ({
  fontFamily,
  fontSize,
  fontWeight,
  handleInputChange,
}: TextProps) => (
  <div className='flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3'>
    <h3 className='text-xs uppercase'>Text</h3>

    <div className='flex flex-col gap-3'>
      {RenderSelect({
        config: selectConfigs[0],
        fontSize,
        fontWeight,
        fontFamily,
        handleInputChange,
      })}

      <div className='flex gap-2'>
        {selectConfigs.slice(1).map((config) =>
          RenderSelect({
            config,
            fontSize,
            fontWeight,
            fontFamily,
            handleInputChange,
          })
        )}
      </div>
    </div>
  </div>
);

type Props = {
  config: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  handleInputChange: (property: string, value: string) => void;
};

const getSelectedValue = (config: Props) => {
  const { fontSize, fontWeight, fontFamily, handleInputChange } = config;
  switch (config.config.property) {
    case "fontFamily":
      return fontFamily;
    case "fontSize":
      return fontSize;
    case "fontWeight":
      return fontWeight;
    default:
      return "";
  }
}

const getPlaceholder = (config: Props): string => {
  switch (config.config.property){
    case "fontFamily":
      return "Choose a font";
    case "fontSize":
      return "30";
    case "fontWeight":
      return "Semibold";
    default:
      return "";
  }
}

const RenderSelect = ({
  config,
  fontSize,
  fontWeight,
  fontFamily,
  handleInputChange,
}: Props) => (
  <Select
    key={config.property}
    onValueChange={(value) => handleInputChange(config.property, value)}
    value={getSelectedValue({config, fontSize, fontWeight, fontFamily, handleInputChange})}
  >
    <SelectTrigger className='no-ring w-full rounded-sm border border-primary-grey-200'>
      <SelectValue placeholder={getPlaceholder({config, fontSize, fontWeight, fontFamily, handleInputChange})}
      />
    </SelectTrigger>
    <SelectContent className='border-primary-grey-200 bg-primary-black text-primary-grey-300'>
      {config.options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          className=' hover:bg-primary-green hover:text-primary-black'
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);



export default Text;
