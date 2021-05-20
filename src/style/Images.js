function DetailsPlaceholder() {
  return "data:image/png;base64,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";
}

export { DetailsPlaceholder };
