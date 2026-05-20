# 1. Encontra todos os arquivos .avif
mapfile -t files < <(find . -type f -name "*.avif")
total=${#files[@]}
current=0
optimized=0

if [ $total -gt 0 ]; then
    for img in "${files[@]}"; do
        ((current++))
        
        # Verifica o tamanho atual do arquivo em KB
        size_kb=$(du -k "$img" | cut -f1)
        
        # Se for maior que 200 KB, otimiza
        if [ "$size_kb" -gt 200 ]; then
            ((optimized++))
            echo -ne " Progresso: [$current/$total] Otimizando: $(basename "$img") (${size_kb}KB)\033[K\r"
            
            # Recodifica com qualidade menor (50) para forçar a redução do tamanho
            # O ImageMagick salva por cima do arquivo original de forma segura
            magick "$img" -quality 60 "$img"
        else
            echo " Progresso: [$current/$total] Pulando (Já menor que 200KB): $(basename "$img")\033[K\r"
        fi
    done
    echo -e "\n Concluído! Total de arquivos analisados: $total. Arquivos reduzidos: $optimized."
else
    echo "Nenhum arquivo .avif encontrado."
fi

