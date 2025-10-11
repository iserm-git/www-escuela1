graph TD
    Root[RootLayout] --> HTML[HTML]
    HTML --> Body[Body]
    Body --> Providers
    
    Providers --> Auth[AuthProvider]
    Providers --> Theme[ThemeProvider + CssBaseline]
    Providers --> Chrome
    
    Chrome --> Navbar[Navbar]
    Chrome --> Children[children]
    Chrome --> Footer
    
    Navbar --> AppBar
    AppBar --> Logo[SchoolIcon + Typography]
    AppBar --> Menu[Menu Buttons]
    
    Menu --> Inicio[Inicio - ACTIVO ✓]
    Menu --> Alumnos
    Menu --> Profesores
    Menu --> Materias
    Menu --> Grupos
    Menu --> Reportes
    Menu --> Gestion[Gestión Escolar]
    
    Children --> Protected
    Protected --> Dashboard
    Dashboard --> KPIs[4 KPI Cards]
    
    style Navbar fill:#4CAF50,stroke:#2E7D32,stroke-width:4px
    style Inicio fill:#1976d2,stroke:#0D47A1,stroke-width:3px
    style Chrome fill:#FF9800,stroke:#F57C00,stroke-width:2px