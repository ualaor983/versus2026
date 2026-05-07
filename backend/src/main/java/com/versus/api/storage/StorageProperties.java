package com.versus.api.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "versus.storage")
public class StorageProperties {

    private String localRoot = "target/local-storage";
    private String publicPath = "/media-files/";
    private String publicBaseUrl = "";
    private long maxFileSizeBytes = 10 * 1024 * 1024;
    private long maxAvatarSizeBytes = 2 * 1024 * 1024;
    private List<String> allowedContentTypes = new ArrayList<>(List.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "audio/mpeg",
            "audio/ogg",
            "application/pdf",
            "text/plain"
    ));
    public String getLocalRoot() {
        return localRoot;
    }

    public void setLocalRoot(String localRoot) {
        this.localRoot = localRoot;
    }

    public String getPublicPath() {
        return publicPath;
    }

    public void setPublicPath(String publicPath) {
        this.publicPath = publicPath;
    }

    public String getPublicBaseUrl() {
        return publicBaseUrl;
    }

    public void setPublicBaseUrl(String publicBaseUrl) {
        this.publicBaseUrl = publicBaseUrl;
    }

    public long getMaxFileSizeBytes() {
        return maxFileSizeBytes;
    }

    public void setMaxFileSizeBytes(long maxFileSizeBytes) {
        this.maxFileSizeBytes = maxFileSizeBytes;
    }

    public long getMaxAvatarSizeBytes() {
        return maxAvatarSizeBytes;
    }

    public void setMaxAvatarSizeBytes(long maxAvatarSizeBytes) {
        this.maxAvatarSizeBytes = maxAvatarSizeBytes;
    }

    public List<String> getAllowedContentTypes() {
        return allowedContentTypes;
    }

    public void setAllowedContentTypes(List<String> allowedContentTypes) {
        this.allowedContentTypes = allowedContentTypes;
    }

}
