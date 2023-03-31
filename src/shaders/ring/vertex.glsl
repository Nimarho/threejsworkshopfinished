uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float aBlinking;

varying vec3 vColor;
varying vec2 vUv;

void main()
{
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float distanceToCenter = length(modelPosition.xz);
    float angle = atan(modelPosition.x, modelPosition.z);
    float angleOffset = -uTime/2.0;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    vColor = color;

    /**
     * Size
     */
    gl_PointSize = (uSize * aScale) * (cos(uTime*aBlinking));
    gl_PointSize *= (1.0 / - viewPosition.z);
}