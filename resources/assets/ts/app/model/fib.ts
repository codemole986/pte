export class ParagraphItem {
  type: string;
  value: string;
  options?: string[] | any[];
}

export class Paragraph {
  items: ParagraphItem[]
}
