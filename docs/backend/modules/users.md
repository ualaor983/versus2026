# Módulo: Usuarios

Paquete raíz: `com.versus.api.users`  
Estado: ✅ implementado (Sprint 1)

---

## Responsabilidad

Gestión del perfil de usuario autenticado y consulta de perfiles públicos. Este módulo **no** maneja autenticación (delegada a `auth`) ni estadísticas de juego (delegadas a `stats`).

---

## Diagrama de clases

```mermaid
classDiagram
    class UserController {
        <<RestController>>
        <<RequiresAuth>>
        +GET /api/users/me
        +PUT /api/users/me
        +PUT /api/users/me/avatar
        +GET /api/users/{id}
    }

    class UserService {
        <<Service>>
        -UserRepository userRepo
        -MediaService mediaService
        +getMe(UUID userId) UserMeResponse
        +updateMe(UUID userId, UpdateMeRequest) UserMeResponse
        +updateAvatar(UUID userId, MultipartFile) UserMeResponse
        +getPublic(UUID targetId) UserPublicResponse
    }

    class User {
        <<Entity>>
        <<Table: users>>
        +UUID id
        +String username
        +String email
        +String passwordHash
        +String avatarUrl
        +Role role
        +Instant createdAt
        +Instant updatedAt
        +boolean isActive
    }

    class Role {
        <<Enumeration>>
        PLAYER
        MODERATOR
        ADMIN
    }

    class UserRepository {
        <<Repository>>
        +findByEmail(String) Optional~User~
        +findByUsername(String) Optional~User~
        +existsByUsername(String) boolean
        +existsByEmail(String) boolean
    }

    class UserMeResponse {
        <<DTO>>
        +UUID id
        +String username
        +String email
        +String avatarUrl
        +String role
        +Instant createdAt
    }

    class UserPublicResponse {
        <<DTO>>
        +UUID id
        +String username
        +String avatarUrl
        +String role
        +Instant createdAt
    }

    class UpdateMeRequest {
        <<DTO>>
        +String username
        +String avatarUrl
    }

    UserController --> UserService : delega
    UserService --> UserRepository : consulta/persiste
    UserRepository --> User : gestiona
    User --> Role : usa
    UserService ..> UserMeResponse : produce
    UserService ..> UserPublicResponse : produce
```

---

## Endpoints

| Método | Ruta | Auth | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/api/users/me` | Bearer | — | `200` `UserMeResponse` |
| `PUT` | `/api/users/me` | Bearer | `UpdateMeRequest` | `200` `UserMeResponse` |
| `PUT` | `/api/users/me/avatar` | Bearer | `multipart/form-data` con `file` | `200` `UserMeResponse` |
| `GET` | `/api/users/{id}` | Bearer | — | `200` `UserPublicResponse` |

### Diferencia entre `UserMeResponse` y `UserPublicResponse`

| Campo | `/me` | `/{id}` |
|---|---|---|
| `email` | ✅ | ❌ |
| `username` | ✅ | ✅ |
| `avatarUrl` | ✅ | ✅ |
| `role` | ✅ | ✅ |
| `createdAt` | ✅ | ✅ |

El email es dato privado — nunca se expone en el endpoint público.

### Errores comunes

| Situación | ErrorCode | HTTP |
|---|---|---|
| Usuario no encontrado (`/me` o `/{id}`) | `NOT_FOUND` | 404 |
| Nuevo username ya en uso | `CONFLICT` | 409 |
| Body inválido | `VALIDATION_ERROR` | 400 |

---

## Entidad: `User`

```
Tabla: users
┌──────────────┬───────────────────────────────────────────────┐
│ Columna      │ Notas                                         │
├──────────────┼───────────────────────────────────────────────┤
│ id           │ UUID, PK, generado automáticamente            │
│ username     │ VARCHAR(50), UNIQUE, NOT NULL                 │
│ email        │ VARCHAR(255), UNIQUE, NOT NULL                │
│ password_hash│ VARCHAR(255), BCrypt                          │
│ avatar_url   │ VARCHAR(500), nullable                        │
│ role         │ ENUM(PLAYER, MODERATOR, ADMIN), default PLAYER│
│ created_at   │ TIMESTAMPTZ, @PrePersist                      │
│ updated_at   │ TIMESTAMPTZ, @PreUpdate                       │
│ is_active    │ BOOLEAN, default true                         │
└──────────────┴───────────────────────────────────────────────┘
Índices: email (UNIQUE), username (UNIQUE)
```

### Lifecycle hooks JPA

- `@PrePersist`: inicializa `createdAt`, `updatedAt = now()`, `isActive = true`, `role = PLAYER`
- `@PreUpdate`: actualiza `updatedAt = now()`

---

## Reglas de negocio

1. **Email inmutable**: no se puede cambiar el email tras el registro (no hay campo en `UpdateMeRequest`).
2. **Contraseña no editable aquí**: el cambio de contraseña es responsabilidad del módulo `auth` (flujo futuro).
3. **Avatar por URL o subida**: `PUT /api/users/me` conserva `avatarUrl` para compatibilidad, pero `PUT /api/users/me/avatar` delega en `media` y actualiza la URL tras subir la imagen.
4. **Soft delete**: `isActive = false` marca al usuario como inactivo sin eliminarlo de la BD. Los endpoints de usuarios no filtran por `isActive` actualmente — tener en cuenta para futuras consultas.

---

## Cómo obtener el `userId` en un controller

Spring Security expone el sujeto del JWT como `@AuthenticationPrincipal`:

```java
@GetMapping("/me")
public UserMeResponse getMe(@AuthenticationPrincipal UUID userId) {
    return userService.getMe(userId);
}
```

El `UUID` viene del claim `sub` del access token, inyectado por `JwtAuthFilter` al crear el `UsernamePasswordAuthenticationToken`.

---

## Extensión futura

- Endpoint `DELETE /api/users/me` para baja voluntaria (soft delete).
- Endpoint `PUT /api/users/me/password` para cambio de contraseña (requiere contraseña actual).
- Selección de avatar desde galería predefinida.
