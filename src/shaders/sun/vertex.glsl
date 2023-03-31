varying vec3 vColor;

void main()
{
    vColor = color;
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
     * Size
     */
    gl_PointSize = 5000.0;
    gl_PointSize *= (1.0 / - viewPosition.z);
}