passo a passo pro backend

Instale o uv:
```
irm https://astral.sh/uv/install.ps1 | iex
```

Crie e Ative o Ambiente Virtual
Dentro da pasta backend/, execute:

```
uv venv
source .venv/bin/activate # No Windows: .venv\Scripts\Activate
```

Instale as Dependências
Com o ambiente virtual ativo, instale os pacotes necessários:

```
uv pip install -r requirements.txt
```
